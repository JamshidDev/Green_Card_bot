const { Bot, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");

require('dotenv').config()
const Database = require("./db");
const customLogger = require("./config/customLogger");
const { check_user,register_user, remove_user, set_user_lang } = require("./controllers/userController");
const { limit } = require("@grammyjs/ratelimiter");
const { autoRetry } = require("@grammyjs/auto-retry");


const client_bot = require("./modules/clientModules");
const admin_bot = require("./modules/adminModules")
const {config_bot} = require("./modules/configModules")

const bot_token = process.env.BOT_TOKEN;
const ERROR_CHANNEL_ID = -1001881609984;






const bot = new Bot(bot_token);
bot.api.config.use(autoRetry({
    maxRetryAttempts: 1, // only repeat requests once
    maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
}));
bot.use(
    limit({
        // Allow only 3 messages to be handled every 2 seconds.
        timeFrame: 2000,
        limit: 3,

        // "MEMORY_STORE" is the default value. If you do not want to use Redis, do not pass storageClient at all.
        //   storageClient: MEMORY_STORE,

        // This is called when the limit is exceeded.
        onLimitExceeded: async (ctx) => {
            await ctx.reply("✋ Please refrain from sending too many requests!");
        },

        // Note that the key should be a number in string format such as "123456789".
        keyGenerator: (ctx) => {
            return ctx.from?.id.toString();
        },
    })
);


bot.use(config_bot)

bot.use(client_bot)
bot.use(admin_bot)


bot.chatType("private").filter(async(ctx)=>{
    return ctx.config.client
}).use(async(ctx, next)=>{
    let user = await check_user(ctx.from?.id);
    if(user){
        await ctx.i18n.setLocale(user.lang);
    }else{
        await ctx.i18n.setLocale("uz");
    }
    await ctx.conversation.enter("menu_conversation");
    
    next()
})


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const message = err.error;
    customLogger.log({
        level: 'error',
        message: message
    });

    bot.api.sendMessage(ERROR_CHANNEL_ID,`
 <b>⚠️ Error Notefication</b>
 
 <b>Error message: <i>${message}</i></b>
    `, {
        parse_mode:"HTML"
    })
});



bot.start();