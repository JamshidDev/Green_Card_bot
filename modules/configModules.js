const { Composer, MemorySessionStorage, session } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
} = require("@grammyjs/conversations");
const {remove_user } = require("../controllers/userController");


const config_bot = new Composer();

const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});
config_bot.use(i18n);


config_bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                condidate: {
                    fullname: null,
                    birthday: null,
                    picture: null,
                    pasport:null,
                    live_adress: null,
                    birth_adress: null,
                    phone: null,
                    education: null,
                    marital_status: null,
                },
                children_list: [],
                husband_woman: {
                    fullname: null,
                    birthday: null,
                    picture: null,
                    pasport: null,
                },
                selected_check:null,
            }
        },
        storage: new MemorySessionStorage(),
        getSessionKey: (ctx) => ctx.chat?.id.toString(),
    },
    conversation: {},
    __language_code: {},
}));
config_bot.use(conversations());


config_bot.on("my_chat_member", async (ctx) => {
    if (ctx.update.my_chat_member.new_chat_member.status == "kicked") {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
        await remove_user(ctx.from.id)
    }

});

config_bot.use(async (ctx, next) => {
    let permission_list = [ctx.t("cancel_action_btn_text"), ctx.t("no_have_child")]

    if (permission_list.includes(ctx.message?.text)) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }
    ctx.config = {
        is_admin: true
    }
    await next()
})


























module.exports = { config_bot }