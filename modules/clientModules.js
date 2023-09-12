const { Composer, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");
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
pm.use(createConversation(menu_conversation));
pm.use(createConversation(register_anketa_conversation));
pm.use(createConversation(children_counter_conversation));

// conversation 

async function main_menu_conversation(conversation, ctx) {
    let main_menu = new Keyboard()
        .text(ctx.t("register_btn_text"))
        .row()
        .text(ctx.t("my_anketa_btn_text"))
        .text(ctx.t("call_center_btn_text"))
        .row()
        .resized();
    await ctx.reply(ctx.t("service_info"), {
        parse_mode: "HTML",
        reply_markup: main_menu
    })
    return;
}

async function menu_conversation(conversation, ctx) {
    let main_menu = new Keyboard()
        .text(ctx.t("register_btn_text"))
        .row()
        .text(ctx.t("my_anketa_btn_text"))
        .text(ctx.t("call_center_btn_text"))
        .row()
        .resized();
    await ctx.reply(ctx.t("main_menu_btn_text"), {
        parse_mode: "HTML",
        reply_markup: main_menu
    })
    return;
}

async function register_anketa_conversation(conversation, ctx) {
    let abort_action_btn = new Keyboard()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    await ctx.reply(ctx.t("warning_data_text"), {
        parse_mode: "HTML",
        reply_markup: abort_action_btn
    })

    // Fullname
    await ctx.reply(ctx.t("fullname_text"), {
        parse_mode: "HTML"
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
        parse_mode: "HTML"
    })

    ctx = await conversation.wait();

    if (!(ctx.message?.text && ctx.message?.text?.length == 10)) {
        do {
            await ctx.reply(ctx.t("birthdate_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && ctx.message?.text?.length == 10));
    }
    let birthdate = ctx.message.text;

    // picture
    await ctx.reply(ctx.t("picture_text"), {
        parse_mode: "HTML"
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
        parse_mode: "HTML"
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

    // country
    await ctx.reply(ctx.t("country_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();
    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t("country_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }
    let country = ctx.message.text;

    // Phone number
    await ctx.reply(ctx.t("phone_number_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();
    if (!(ctx.message?.text && ctx.message?.text?.length == 13)) {
        do {
            await ctx.reply(ctx.t("phone_number_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && ctx.message?.text?.length == 13));
    }
    let phone_number = ctx.message.text;

    // Education
    let education_keyboard = new Keyboard()
        .text(ctx.t("education_1"))
        .row()
        .text(ctx.t("education_2"))
        .row()
        .text(ctx.t("education_3"))
        .row()
        .text(ctx.t("education_4"))
        .row()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    await ctx.reply(ctx.t("aducation_text"), {
        parse_mode: "HTML",
        reply_markup: education_keyboard
    })
    ctx = await conversation.wait();
    let education_list = [ctx.t("education_1"), ctx.t("education_2"), ctx.t("education_3"), ctx.t("education_4")]
    console.log(ctx.message);
    if (!(ctx.message?.text && education_list.includes(ctx.message?.text))) {
        do {
            await ctx.reply(ctx.t("aducation_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && education_list.includes(ctx.message?.text)));
    }
    let education = ctx.message.text;

    // Marital status
    let marital_keyboard = new Keyboard()
        .text(ctx.t("marital_1"))
        .row()
        .text(ctx.t("marital_2"))
        .row()
        .text(ctx.t("marital_3"))
        .row()
        .text(ctx.t("marital_4"))
        .row()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    await ctx.reply(ctx.t("marital_status_text"), {
        parse_mode: "HTML",
        reply_markup: marital_keyboard
    })
    ctx = await conversation.wait();
    let marital_list = [ctx.t("marital_1"), ctx.t("marital_2"), ctx.t("marital_3"), ctx.t("marital_4")]
    if (!(ctx.message?.text && marital_list.includes(ctx.message?.text))) {
        do {
            await ctx.reply(ctx.t("aducation_error_text"), {
                parse_mode: "HTML",
                reply_markup: marital_keyboard
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && marital_list.includes(ctx.message?.text)));
    }
    let merital = ctx.message.text;

    if(ctx.message.text == ctx.t("marital_1") ){
        await ctx.reply("Tugadi.")
    }
    

}

async function children_counter_conversation(conversation, ctx){
    await ctx.reply("Farzandlaringiz sonini kiriting");
    let amout_children = await conversation.wait();

    for(let number=1; number<= 4; number++){

        await ctx.reply(ctx.t("child_fullname_text", {
            number
        }));
        ctx = await conversation.wait();
        if (!ctx.message?.text) {
            do {
                await ctx.reply(ctx.t("child_fullname_error_text"), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.text);
        }
        let child_fullname = ctx.message.text;
        console.log("1 -" + child_fullname);
        
    }

    

}




pm.command("children", async(ctx)=>{
    await ctx.conversation.enter("children_counter_conversation");
})







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
    await ctx.conversation.enter("menu_conversation");
});














module.exports = bot 