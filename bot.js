const { Bot, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");
// const { Menu, MenuRange } = require("@grammyjs/menu");
// const { I18n, hears } = require("@grammyjs/i18n");
// const {
//     conversations,
//     createConversation,
// } = require("@grammyjs/conversations");
require('dotenv').config()
const Database = require("./db");
const customLogger = require("./config/customLogger");
// const { check_user,register_user, remove_user, set_user_lang } = require("./controllers/userController");

// modules

const client_bot = require("./modules/clientModules");
const {config_bot} = require("./modules/configModules")

const bot_token = process.env.BOT_TOKEN;







const bot = new Bot(bot_token);

bot.use(config_bot)

bot.use(client_bot)


bot.use(async(ctx, next)=>{
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
});



bot.start();