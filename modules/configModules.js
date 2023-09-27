const { Composer, MemorySessionStorage, session } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
} = require("@grammyjs/conversations");
const { remove_user } = require("../controllers/userController");
const { register_admin, get_admins } = require("../controllers/adminController")



const config_bot = new Composer();
let SUPER_ADMIN_ID = [5604998397, 369413829,46358166 ];
let PAYMENT_ADMIN_ID = [];
let WORKER_ADMINS = [];


const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});



config_bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                condidate: {
                    fullname: null,
                    birthday: null,
                    picture: null,
                    pasport: null,
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
                selected_check: null,
                selected_payment_order: null,
                selected_payment_check: null,
                order_details: null,
                admin_list: [],
                is_update_admin: true,
                selected_admin:null,
            }
        },
        storage: new MemorySessionStorage(),
        getSessionKey: (ctx) => ctx.chat?.id.toString(),
    },
    conversation: {},
    __language_code: {},
}));

// config_bot.api.config.use(autoRetry({
//     maxRetryAttempts: 1, // only repeat requests once
//     maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
// }));
config_bot.use(i18n);
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
    let permission_list = [ctx.t("cancel_action_btn_text"), ctx.t("no_have_child"), "✅ Ro'yhatga olish", "👨‍💻 Ro'yhatga olish"]
    let lang = await ctx.i18n.getLocale();
    if(!i18n.locales.includes(lang)){
        await ctx.i18n.setLocale("uz");
    }
    // console.log(lang);
    if (permission_list.includes(ctx.message?.text)) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }

    let admin_status = ctx.session.session_db.is_update_admin;
    let admins_list = ctx.session.session_db.admin_list;
    if (admin_status) {
        let admins = await get_admins() || [];
        admins_list = admins.map(item => item.user_id)
        ctx.session.session_db.admin_list = admins_list;
        ctx.session.session_db.is_update_admin = false
    }
    WORKER_ADMINS = admins_list;


    ctx.config = {
        super_admin: SUPER_ADMIN_ID.includes(ctx.from?.id),
        payment_admin: PAYMENT_ADMIN_ID.includes(ctx.from?.id),
        worker_admin: WORKER_ADMINS.includes(ctx.from?.id),
        client: !(SUPER_ADMIN_ID.includes(ctx.from?.id) || PAYMENT_ADMIN_ID.includes(ctx.from?.id) || WORKER_ADMINS.includes(ctx.from?.id)),
    }
    await next()
})


























module.exports = { config_bot }