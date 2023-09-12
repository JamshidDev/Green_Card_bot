const { Composer,session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder  } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
const { check_user, register_user, remove_user, set_user_lang } = require("../controllers/userController");

const bot = new Composer();
const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});
bot.use(i18n);






const pm = bot.chatType("private")




pm.use(createConversation(main_menu_conversation));
pm.use(createConversation(register_anketa_conversation));

// conversation 

async function main_menu_conversation(conversation, ctx){
    let main_menu = new Keyboard()
    .text("♻️ Anketa to'ldirish")
    .row()
    .text("📨 Anketalarim")
    .text("☎️ Kontaktlar")
    .row()
    .resized();
    await ctx.reply(ctx.t("service_info"), {
        parse_mode:"HTML",
        reply_markup:main_menu
    })
    return ;
}

async function register_anketa_conversation(conversation, ctx){
        let abort_action_btn = new Keyboard()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
        await ctx.reply(ctx.t("warning_data_text"), {
            parse_mode:"HTML",
            reply_markup:abort_action_btn
        })

        // Fullname
        await ctx.reply(ctx.t("fullname_text"), {
            parse_mode:"HTML"
        })

        ctx = await conversation.wait();

        if (!ctx.message?.text) {
            do {
                await ctx.reply(ctx.t("fullname_error_text"), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.text);
        }

        let fullname = ctx.message.text;

        // Birthday
        await ctx.reply(ctx.t("birthdate_text"), {
            parse_mode:"HTML"
        })

        ctx = await conversation.wait();

        if (!(ctx.message?.text && ctx.message?.text?.length == 10)) {
            do {
                await ctx.reply(ctx.t("birthdate_error_text"), {
                    parse_mode:"HTML"
                })
                ctx = await conversation.wait();
            } while (!(ctx.message?.text && ctx.message?.text?.length == 10));
        }
        let birthdate = ctx.message.text;

        // picture
        await ctx.reply(ctx.t("picture_text"), {
            parse_mode:"HTML"
        })

        ctx = await conversation.wait();

        if (!ctx.message?.photo) {
            do {
                await ctx.reply(ctx.t("picture_error_text"), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.photo);
        }

        let picture = ctx.message.photo;

         // adress uz
         await ctx.reply(ctx.t("uz_adress_text"), {
            parse_mode:"HTML"
        })

        ctx = await conversation.wait();

        if (!ctx.message?.text) {
            do {
                await ctx.reply(ctx.t("uz_adress_error_text"), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.text);
        }

        let adress_uz = ctx.message.text;
      
        
}












const language_menu = new Menu("language_menu")
    .dynamic(async (ctx, range) => {
        let list = [{
            name: "language_uz",
            key: "uz"
        },
        {
            name: "language_ru",
            key: "ru"
        }
        ]
        list.forEach((item) => {
            range
                .text(ctx.t(item.name), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.i18n.setLocale(item.key);
                    data = {
                        user_id: ctx.from.id,
                        lang: item.key
                    }
                    await set_user_lang(data);
                    await ctx.deleteMessage();
                    await ctx.conversation.enter("main_menu_conversation");

                })
                .row();
        })
    })
pm.use(language_menu)


pm.command("start", async (ctx) => {
    let lang = await ctx.i18n.getLocale();
    if (!i18n.locales.includes(lang)) {
        await ctx.i18n.setLocale("uz");
    }
    let user = await check_user(ctx.from.id);
    data = {
        user_id: ctx.from.id,
        full_name: ctx.from.first_name,
        username: ctx.from.username || null,
        active: true
    }
    if (user) {
        await ctx.i18n.setLocale(user.lang);
        data.lang = user.lang;
        await register_user(data);
        await ctx.conversation.enter("main_menu_conversation");
    } else {
        lang = await ctx.i18n.getLocale()
        data.lang = lang;
        await register_user(data);
        await ctx.reply(ctx.t("start_hello_msg", {
            full_name: ctx.from.first_name,
            organization_name: ctx.me.first_name
        }), {
            parse_mode: "HTML",
            reply_markup: language_menu
        })
    }
    
})

































bot.filter(hears("register_btn_text"), async (ctx) => {
    await ctx.conversation.enter("register_anketa_conversation");
});

bot.filter(hears("cancel_action_btn_text"), async (ctx) => {
    await ctx.conversation.enter("main_menu_conversation");
});














module.exports =  bot 