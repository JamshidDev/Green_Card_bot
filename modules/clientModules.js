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
pm.use(createConversation(children_counter_conversation));
pm.use(createConversation(husband_woman_conversation));
pm.use(createConversation(register_anketa_conversation));



// conversation 

async function main_menu_conversation(conversation, ctx) {
    let main_menu = new Keyboard()
    .text(ctx.t("register_btn_text"))
    .row()
    .text(ctx.t("my_anketa_btn_text"))
    .text(ctx.t("ticket_payment_btn_text"))
    .row()
    .text(ctx.t("guid_btn_text"))
    .text(ctx.t("call_center_btn_text"))
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
        .text(ctx.t("ticket_payment_btn_text"))
        .row()
        .text(ctx.t("guid_btn_text"))
        .text(ctx.t("call_center_btn_text"))
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
    conversation.session.session_db.condidate.fullname = ctx.message.text

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
    conversation.session.session_db.condidate.birthday = ctx.message.text

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
    conversation.session.session_db.condidate.picture = ctx.message.photo


    // Pasport
    await ctx.reply(ctx.t("pasport_text"), {
        parse_mode: "HTML"
    })

    ctx = await conversation.wait();

    if (!ctx.message?.photo) {
        do {
            await ctx.reply(ctx.t("pasport_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.photo);
    }

    let pasport = ctx.message.photo;
    conversation.session.session_db.condidate.pasport = ctx.message.photo


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
    conversation.session.session_db.condidate.live_adress = ctx.message.text


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
    conversation.session.session_db.condidate.birth_adress = ctx.message.text

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
    conversation.session.session_db.condidate.phone = ctx.message.text

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
    if (!(ctx.message?.text && education_list.includes(ctx.message?.text))) {
        do {
            await ctx.reply(ctx.t("aducation_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && education_list.includes(ctx.message?.text)));
    }
    let education = ctx.message.text;
    conversation.session.session_db.condidate.education = ctx.message.text


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
            await ctx.reply(ctx.t("marital_status_error_text"), {
                parse_mode: "HTML",
                reply_markup: marital_keyboard
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && marital_list.includes(ctx.message?.text)));
    }
    let merital = ctx.message.text;
    conversation.session.session_db.condidate.marital_status = ctx.message.text

    if (ctx.message.text == ctx.t("marital_1")) {
        await anketa_list(ctx)
    } else if (ctx.message.text == ctx.t("marital_2")) {
        await ctx.conversation.enter("husband_woman_conversation");
    } else if (ctx.message.text == ctx.t("marital_3")) {
        await ctx.conversation.enter("children_counter_conversation");
    } else if (ctx.message.text == ctx.t("marital_4")) {
        await ctx.conversation.enter("children_counter_conversation");
    }
}




async function husband_woman_conversation(conversation, ctx) {
    let abort_action_btn = new Keyboard()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    await ctx.reply(ctx.t("hw_fullname_text"), {
        parse_mode: "HTML",
        reply_markup: abort_action_btn,
    })
    ctx = await conversation.wait();
    if (!ctx.message?.text) {
        do {
            await ctx.reply(ctx.t("hw_fullanme_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    conversation.session.session_db.husband_woman.fullname = ctx.message.text;
    await ctx.reply(ctx.t("hw_birthdate_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();
    if (!(ctx.message?.text && ctx.message?.text?.length == 10)) {
        do {
            await ctx.reply(ctx.t("hw_birthdate_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && ctx.message?.text?.length == 10));
    }
    conversation.session.session_db.husband_woman.birthday = ctx.message.text;
    await ctx.reply(ctx.t("hw_picture_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();

    if (!ctx.message?.photo) {
        do {
            await ctx.reply(ctx.t("hw_picture_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.photo);
    }
    conversation.session.session_db.husband_woman.picture = ctx.message.photo;
    await ctx.reply(ctx.t("hw_pasport_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();
    if (!ctx.message?.photo) {
        do {
            await ctx.reply(ctx.t("hw_pasport_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.photo);
    }
    conversation.session.session_db.husband_woman.pasport = ctx.message.photo;
    await ctx.conversation.enter("children_counter_conversation");


};



async function children_counter_conversation(conversation, ctx) {
    let child_keyboard = new Keyboard()
        .text(ctx.t("no_have_child"))
        .row()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    await ctx.reply(ctx.t("children_count_text"), {
        parse_mode: "HTML",
        reply_markup: child_keyboard
    });
    ctx = await conversation.wait();

    if (!(ctx.message?.text && !isNaN(ctx.message.text) && ctx.message.text?.length == 1 && ctx.message.text != '0')) {
        do {
            await ctx.reply(ctx.t("children_count_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!(ctx.message?.text && !isNaN(ctx.message.text) && ctx.message.text?.length == 1 && ctx.message.text != '0'));
    }
    let children_count = +ctx.message.text;

    let abort_action_btn = new Keyboard()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();
    for (let number = 1; number <= children_count; number++) {
        let children = {
            number: null,
            fullname: null,
            birthday: null,
            picture: null,
            pasport: null,
        }
        // child fullname
        await ctx.reply(ctx.t("child_fullname_text", {
            number
        }), {
            parse_mode: "HTML",
            reply_markup: abort_action_btn,
        });
        ctx = await conversation.wait();
        if (!ctx.message?.text) {
            do {
                await ctx.reply(ctx.t("child_fullname_error_text", {
                    number
                }), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.text);
        }
        children.number = number;
        children.fullname = ctx.message.text;
        // child birthday
        await ctx.reply(ctx.t("child_birthday_text", {
            number
        }), {
            parse_mode: "HTML",
        });
        ctx = await conversation.wait();
        if (!(ctx.message?.text && ctx.message?.text?.length == 10)) {
            do {
                await ctx.reply(ctx.t("child_birthday_error_text", {
                    number
                }), {
                    parse_mode: "HTML"
                })
                ctx = await conversation.wait();
            } while (!(ctx.message?.text && ctx.message?.text?.length == 10));
        }
        children.birthday = ctx.message.text;
        // child picture
        await ctx.reply(ctx.t("child_picture_text", {
            number
        }), {
            parse_mode: "HTML",
        });
        ctx = await conversation.wait();
        if (!ctx.message?.photo) {
            do {
                await ctx.reply(ctx.t("child_picture_error_text", {
                    number
                }), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.photo);
        }
        children.picture = ctx.message.photo;


        // child pasport picture
        await ctx.reply(ctx.t("child_pasport_text", {
            number
        }), {
            parse_mode: "HTML",
        });
        ctx = await conversation.wait();
        if (!ctx.message?.photo) {
            do {
                await ctx.reply(ctx.t("child_pasport_error_text", {
                    number
                }), {
                    parse_mode: "HTML",
                });
                ctx = await conversation.wait();
            } while (!ctx.message?.photo);
        }
        children.pasport = ctx.message.photo;
        conversation.session.session_db.children_list.push(children);
    }
    await anketa_list(ctx)
}

const anketa_list = async (ctx) => {
    let anketa_keyboard = new Keyboard()
        .text(ctx.t("confirm_anketa_btn_text"))
        .row()
        .text(ctx.t("cancel_action_btn_text"))
        .text(ctx.t("refull_anketa_btn_text"))
        .resized();
    let candidate = ctx.session.session_db.condidate;
    let hw = ctx.session.session_db.husband_woman;
    let children_list = ctx.session.session_db.children_list;
    let candidate_text = `
<b>📌 Anketadagi tekshiring va barcha ma'lumotlaringiz to'g'riligiga ishonch hosil qiling!</b>
<i>Barcha ma'lumotlar to'g'ri bo'lgan holatda <b>✅ Tasdiqlash</b> tugmasini bosing.</i>
<i>Ma'lumotlarda qandaydir xatolik bo'lsa <b>🔄 Qayta to'ldirish</b> tugmasini bosing.</i>

F .I .SH: <b>${candidate.fullname}</b>
Tug'ilgan sana: <b>${candidate.birthday}</b>
Rasm: <b>${candidate.picture.length > 0 ? 'Bor' : "Yo'q"}</b>
Pasport rasmi: <b>${candidate.pasport.length > 0 ? 'Bor' : "Yo'q"}</b>
Yashash manzil: <b>${candidate.live_adress}</b>
Tug'ilgan manzil: <b>${candidate.birth_adress}</b>
Telefon raqam: <b>${candidate.phone}</b>
Ma'lumoti: <b>${candidate.education}</b>
Oilaviy holati: <b>${candidate.marital_status}</b>`

    if (candidate.marital_status != ctx.t("marital_1")) {
        let hw_text = `

<b>👬 Eri/Ayoli</b>
F .I .SH: <b>${hw.fullname}</b>
Tug'ilgan sana: <b>${hw.birthday}</b>
Rasm: <b>${hw.picture.length > 0 ? 'Bor' : "Yo'q"}</b>
Pasport rasmi: <b>${hw.pasport.length > 0 ? 'Bor' : "Yo'q"}</b>
    `
        candidate_text = candidate_text + hw_text;
    }

    if (children_list.length > 0) {
        let children_count = children_list.length;
        let children_text = `
<b>👨‍👧‍👦 Farzandlar soni - ${children_count} nafar</b>`
        for (let son = 0; son < children_count; son++) {
            let sont_details = `
<i>${children_list[son].number} - Farzand</i>
F .I .SH: <b>${children_list[son].fullname}</b>
Tug'ilgan sana: <b>${children_list[son].birthday}</b>
Rasm: <b>${children_list[son].picture.length > 0 ? 'Bor' : "Yo'q"}</b>
Pasport rasmi: <b>${children_list[son].pasport.length > 0 ? 'Bor' : "Yo'q"}</b>`
            children_text = children_text + sont_details
        }
        candidate_text = candidate_text + children_text;

    } else {
        let children_text = `
<b>👨‍👧‍👦 Farzandlar</b>
<i> 21 yoshga to'lmagan farzandlarim yo'q</i>`
        candidate_text = candidate_text + children_text
    }

    await ctx.reply(candidate_text, {
        parse_mode: "HTML",
        reply_markup: anketa_keyboard
    })
}











pm.command("children", async (ctx) => {
    //     await ctx.reply(`
    // <b>📌 Anketadagi ma'lumotlarni tekshiring va barcha ma'lumotlaringiz to'g'ri bo'lsa tasdiqlash tugmasini bosing!</b>

    // F .I .SH: <b>Raximov Jamshid Shuxrat o'g'li</b>
    // Tug'ilgan sana: <b>02.07.2000</b>
    // Rasm: <b>Bor</b>
    // Pasport rasmi: <b>Bor</b>
    // Yashash manzil: <b> Toshkent viloyati, Toshkent shahri, Tikuvchilar mahallasi 13-uy</b>
    // Tug'ilgan manzil: <b> Toshkent viloyati, Toshkent shahri, Tikuvchilar mahallasi 13-uy</b>
    // Telefon raqam: <b> +998995016004</b>
    // Ma'lumoti: <b> Bakalavir diplomi</b>
    // Oilaviy holati: <b> Uylanmagan/Turmushga chiqmagan</b>
    //     `, {
    //         parse_mode: "HTML"
    //     })

    await anketa_list(ctx)
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
bot.filter(hears("no_have_child"), async (ctx) => {
    await anketa_list(ctx)
});
bot.filter(hears("refull_anketa_btn_text"), async (ctx) => {
    await ctx.conversation.enter("register_anketa_conversation");
});
bot.filter(hears("confirm_anketa_btn_text"), async (ctx) => {
    let candidate = ctx.session.session_db.condidate;
    let hw = ctx.session.session_db.husband_woman;
    let children_list = ctx.session.session_db.children_list;
    console.log(candidate + '\n' + hw + '\n' + children_list);
    await ctx.reply(`
✅  Sizning <b>Green Card</b> uchun ma'lumotlaringiz qabul qilindi.

📨 Buyurtma raqami: <b>24</b>
🕤 Buyurtma sanasi: <b>${new Date().toLocaleString()}</b>
💰 To'lov summasi: <b>100 000 so'm</b>
<i>💳 Karta raqami: <b>5614681401907245</b></i>
<i>👤 Karta egasi: Jamshid Raximov Shuxrat o'g'li</i>
    `, {
        parse_mode: "HTML"
    })

    await ctx.conversation.enter("menu_conversation");

});

bot.filter(hears("guid_btn_text"), async (ctx) => {
    await ctx.reply("Qo'llanma...")
});

bot.filter(hears("call_center_btn_text"), async (ctx) => {
    await ctx.reply("Kontaktlar...")
});

bot.filter(hears("ticket_payment_btn_text"), async (ctx) => {
    await ctx.reply("Chek yuborish...")
});

bot.filter(hears("my_anketa_btn_text"), async (ctx) => {
    await ctx.reply("Anketalarim...")
});













module.exports = bot 