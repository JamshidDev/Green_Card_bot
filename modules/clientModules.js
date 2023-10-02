const { Composer, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
require('dotenv').config()


const { check_user, register_user, user_info, remove_user, set_user_lang } = require("../controllers/userController");
const { register_order, my_orders, check_orders } = require("../controllers/orderControllser");
const { register_payment } = require("../controllers/paymentController");




// Environments variables
const Payment_Id = -1001936916433;
const General_Id = -1001916750534;
const guide_video_uz = 'BAACAgIAAxkBAAIk6WUawPLRVG6Rgt1jCsncGtmzotQoAAJFOQAC8IzQSDsmP3xPiAKGMAQ';
const guide_video_ru = 'BAACAgIAAxkBAAIk8GUawUafcF_4dOJLTRe-MYVk8smHAAItOQACo7vYSKDPHIoYNMzSMAQ';



// Payment card details
const CARD_NUMBER = "5614681816179307";
const CARD_OWNER = "Ergashev Qodirbek";
const SERVICE_PRICE = "100 000"

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



// Helper function

const notefication_payment = async (ctx, file_id, order_number) => {
    await ctx.api.sendPhoto(Payment_Id, file_id, {
        caption: `
<b>🔔 To'lov cheki yuborildi</b>

✉️ Anketa raqami: <b>${order_number}</b>
👤 Yuboruvchi: <a href="tg://user?id=${ctx.from.id}">Telegram (${ctx.from.first_name})</a>`,
        parse_mode: "HTML",
    })
}

const picture_notefication = async (ctx, file_id, full_name, birthday, owner_type, child_number) => {
    // type == candidate; hw; child
    let picture_owner = '';
    if (owner_type == 'candidate') {
        picture_owner = "Kandidat"
    } else if (owner_type == 'hw') {
        picture_owner = "Eri/Ayoli"
    } else if (owner_type == 'child') {
        picture_owner = child_number + " - Farzand"
    }


    let msg_text = `
Rasm egasi: <b>${picture_owner}</b>
👤 F. I. SH: <b>${full_name}</b>
🗓 Tug'ilgan sana: <b>${birthday}</b>
`

    await ctx.api.sendPhoto(General_Id, file_id, {
        caption: msg_text,
        parse_mode: "HTML",
    })

}


const data_sender = async (ctx, data) => {

    let anketa_text = `
 <b>🔔 Yangi anketa yuborildi!</b>

 ✉️ Anketa raqami: <b>${data.order_number}</b>
<b>👤 Yuborivchi: Kandidat</b>

👤 F.I.SH: <b>${data.full_name}</b>
🗓 Tug'ilgan sana: <b>${data.birthday}</b>
📍 Yashash manzili: <b>${data.live_adress}</b>
📍 Tug'ilgan manzili: <b>${data.birth_adress}</b>
📞 Telefon: <b>${data.phone}</b>
🧾 Ma'lumoti: <b>${data.education}</b>
👪 Oilaviy holati: <b>${data.marital_status}</b>

<i>Farzandlar soni ${data.children_list ? data.children_list.length : 0} nafar</i>
    `

    await ctx.api.sendMessage(General_Id, anketa_text, {
        parse_mode: "HTML"
    })
    await picture_notefication(ctx, data.picture[1].file_id, data.full_name, data.birthday, 'candidate', 0)
    // await picture_notefication(ctx, data.pasport[1].file_id, data.full_name, data.birthday, 'candidate', 0)
    if (data.husband_woman) {
        await picture_notefication(ctx, data.husband_woman.picture[1].file_id, data.husband_woman.fullname, data.husband_woman.birthday, 'hw', 0)
        // await picture_notefication(ctx, data.husband_woman.pasport[1].file_id, data.husband_woman.fullname, data.husband_woman.birthday, 'hw', 0)
    }

    if (data.children_list?.length > 0) {
        for (let i = 0; i < data.children_list.length; i++) {
            let child = data.children_list[i];
            await picture_notefication(ctx, child.picture[1].file_id, child.fullname, child.birthday, 'child', child.number);
            // await picture_notefication(ctx, child.pasport[1].file_id, child.fullname, child.birthday, 'child', child.number);

        }
    }
}
























const pm = bot.chatType("private")




pm.use(createConversation(main_menu_conversation));
pm.use(createConversation(menu_conversation));
pm.use(createConversation(children_counter_conversation));
pm.use(createConversation(husband_woman_conversation));
pm.use(createConversation(register_anketa_conversation));
pm.use(createConversation(send_paymentcheck_conversation));





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
    // await ctx.reply(ctx.t("pasport_text"), {
    //     parse_mode: "HTML"
    // })

    // ctx = await conversation.wait();

    // if (!ctx.message?.photo) {
    //     do {
    //         await ctx.reply(ctx.t("pasport_error_text"), {
    //             parse_mode: "HTML",
    //         });
    //         ctx = await conversation.wait();
    //     } while (!ctx.message?.photo);
    // }

    // let pasport = ctx.message.photo;
    // conversation.session.session_db.condidate.pasport = ctx.message.photo

    // country_uz
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

    // Phone number
    await ctx.reply(ctx.t("phone_number_text"), {
        parse_mode: "HTML"
    })
    ctx = await conversation.wait();
    if (!(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t("phone_number_error_text"), {
                parse_mode: "HTML"
            })
            ctx = await conversation.wait();
        } while (!(ctx.message?.text));
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

async function send_paymentcheck_conversation(conversation, ctx) {

    let abort_action_btn = new Keyboard()
        .text(ctx.t("cancel_action_btn_text"))
        .resized();

    if (!conversation.session.session_db.selected_check) {
        await ctx.reply(ctx.t("reaction_text"), {
            parse_mode: "HTML",
        })
        return

    }

    await ctx.reply(ctx.t("check_number_picture_text"), {
        parse_mode: "HTML",
        reply_markup: abort_action_btn
    })

    ctx = await conversation.wait();
    if (!ctx.message?.photo) {
        do {
            await ctx.reply(ctx.t("check_number_picture_error_text"), {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.photo);
    }

    let check_picture = ctx.message.photo;

    const check_payment = ctx.session.session_db.selected_check;
    if (check_payment) {
        let data = {
            order_id: check_payment._id,
            client_id: ctx.from.id,
            payment_picture: check_picture
        };

        await ctx.reply(ctx.t("success_check_text"), {
            parse_mode: "HTML"
        });
        await register_payment(data);
        await notefication_payment(ctx, check_picture[1].file_id, check_payment.order_number)

    } else {
        await ctx.reply(ctx.t("reaction_text"))
    }
    await ctx.conversation.enter("menu_conversation");


};




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
    // await ctx.reply(ctx.t("hw_pasport_text"), {
    //     parse_mode: "HTML"
    // })
    // ctx = await conversation.wait();
    // if (!ctx.message?.photo) {
    //     do {
    //         await ctx.reply(ctx.t("hw_pasport_error_text"), {
    //             parse_mode: "HTML",
    //         });
    //         ctx = await conversation.wait();
    //     } while (!ctx.message?.photo);
    // }
    // conversation.session.session_db.husband_woman.pasport = ctx.message.photo;
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
        // await ctx.reply(ctx.t("child_pasport_text", {
        //     number
        // }), {
        //     parse_mode: "HTML",
        // });
        // ctx = await conversation.wait();
        // if (!ctx.message?.photo) {
        //     do {
        //         await ctx.reply(ctx.t("child_pasport_error_text", {
        //             number
        //         }), {
        //             parse_mode: "HTML",
        //         });
        //         ctx = await conversation.wait();
        //     } while (!ctx.message?.photo);
        // }
        // children.pasport = ctx.message.photo;
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
    let lang = await ctx.i18n.getLocale();
    if(lang == 'uz'){
        // Pasport rasmi: <b>${candidate.pasport.length > 0 ? 'Bor' : "Yo'q"}</b>
        // Pasport rasmi: <b>${hw.pasport.length > 0 ? 'Bor' : "Yo'q"}</b>
        // Pasport rasmi: <b>${children_list[son].pasport.length > 0 ? 'Bor' : "Yo'q"}</b>
        let candidate_text = `
<b>📌 Anketani tekshiring va barcha ma'lumotlaringiz to'g'riligiga ishonch hosil qiling!</b>
<i>Barcha ma'lumotlar to'g'ri bo'lgan holatda <b>✅ Tasdiqlash</b> tugmasini bosing.</i>
<i>Ma'lumotlarda qandaydir xatolik bo'lsa <b>🔄 Qayta to'ldirish</b> tugmasini bosing.</i>
        
F .I .SH: <b>${candidate.fullname}</b>
Tug'ilgan sana: <b>${candidate.birthday}</b>
Rasm: <b>${candidate.picture.length > 0 ? 'Bor' : "Yo'q"}</b>
Yashash manzil: <b>${candidate.live_adress}</b>
Tug'ilgan manzil: <b>${candidate.birth_adress}</b>
Telefon raqam: <b>${candidate.phone}</b>
Ma'lumoti: <b>${candidate.education}</b>
Oilaviy holati: <b>${candidate.marital_status}</b>`
        
            if (candidate.marital_status == ctx.t("marital_2")) {
                let hw_text = `
        
<b>👬 Eri/Ayoli</b>
F .I .SH: <b>${hw.fullname}</b>
Tug'ilgan sana: <b>${hw.birthday}</b>
Rasm: <b>${hw.picture.length > 0 ? 'Bor' : "Yo'q"}</b>
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
Rasm: <b>${children_list[son].picture.length > 0 ? 'Bor' : "Yo'q"}</b>`
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

    }else{
        // Фото на паспорт: <b>${hw.pasport.length > 0 ? 'Есть' : "Нет"}</b>
        // Фото на паспорт: <b>${children_list[son].pasport.length > 0 ? 'Есть' : "Нет"}</b>
        // Фото на паспорт: <b>${candidate.pasport.length > 0 ? 'Есть' : "Нет"}</b>
        let candidate_text = `
<b>📌 Проверьте форму и убедитесь, что вся введенная вами информация верна!</b>
<i>Если вся информация верна, нажмите <b> ✅ Подтверждение</b>.</i>
<i>Если в данных есть ошибка, нажмите кнопку <b>🔄 Пополнение</b>.</i>
        
Ф .И .Ш: <b>${candidate.fullname}</b>
Дата рождения: <b>${candidate.birthday}</b>
Фото: <b>${candidate.picture.length > 0 ? 'Есть' : "Нет"}</b>
Адрес проживания: <b>${candidate.live_adress}</b>
Адрес рождения: <b>${candidate.birth_adress}</b>
Номер телефона: <b>${candidate.phone}</b>
Информация: <b>${candidate.education}</b>
Семейное положение: <b>${candidate.marital_status}</b>`
        
            if (candidate.marital_status == ctx.t("marital_2")) {
                let hw_text = `
        
<b>👬 Муж/Жена</b>
Ф .И .Ш: <b>${hw.fullname}</b>
Дата рождения: <b>${hw.birthday}</b>
Фото: <b>${hw.picture.length > 0 ? 'Есть' : "Нет"}</b>
            `
                candidate_text = candidate_text + hw_text;
            }
        
            if (children_list.length > 0) {
                let children_count = children_list.length;
                let children_text = `
<b>👨‍👧‍👦 Количество детей: ${children_count}</b>`
                for (let son = 0; son < children_count; son++) {
                    let sont_details = `
<i>${children_list[son].number} - Ребенок</i>
Ф .И .Ш: <b>${children_list[son].fullname}</b>
Дата рождения: <b>${children_list[son].birthday}</b>
Фото: <b>${children_list[son].picture.length > 0 ? 'Есть' : "Нет"}</b>`
                    children_text = children_text + sont_details
                }
                candidate_text = candidate_text + children_text;
        
            } else {
                let children_text = `
<b>👨‍👧‍👦 Дети</b>
<i> У меня нет детей младше 21 года.</i>`
                candidate_text = candidate_text + children_text
            }

            await ctx.reply(candidate_text, {
                parse_mode: "HTML",
                reply_markup: anketa_keyboard
            })
    }


   







   




}

// clear session data of user
const clear_seasion_data = async (ctx) => {
    ctx.session.session_db.condidate.fullname = null
    ctx.session.session_db.condidate.birthday = null
    ctx.session.session_db.condidate.picture = []
    ctx.session.session_db.condidate.pasport = []
    ctx.session.session_db.condidate.live_adress = null
    ctx.session.session_db.condidate.birth_adress = null
    ctx.session.session_db.condidate.phone = null
    ctx.session.session_db.condidate.education = null
    ctx.session.session_db.condidate.marital_status = null

    ctx.session.session_db.children_list = []
    ctx.session.session_db.husband_woman.fullname = null
    ctx.session.session_db.husband_woman.birthday = null
    ctx.session.session_db.husband_woman.picture = []
    ctx.session.session_db.husband_woman.pasport = []
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
                    if(ctx.config.client){
                        await ctx.conversation.enter("main_menu_conversation");
                    }
                    

                })
                .row();
        })
    })
pm.use(language_menu)

const guide_video = async(ctx, lang)=>{
    if(lang == 'ru'){
        await ctx.replyWithVideo(guide_video_ru, {
            caption:`
    <b>📚 Видеогид</b>        
            `, 
            parse_mode:"HTML"
        })
    }else{
        await ctx.replyWithVideo(guide_video_uz, {
            caption:`
    <b>📚 Video qo'llanma</b>        
            `, 
            parse_mode:"HTML"
        })
    }
}


pm.filter(async(ctx)=>{
    return ctx.config.client
}).command("start", async (ctx) => {
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
        await guide_video(ctx, lang)
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
        await guide_video(ctx, lang)
    }

})

pm.command("change_language", async (ctx) => {
    await ctx.reply(ctx.t("start_hello_msg", {
        full_name: ctx.from.first_name,
        organization_name: ctx.me.first_name
    }), {
        parse_mode: "HTML",
        reply_markup: language_menu
    })
})



pm.command("my_telegram_id", async(ctx)=>{
    await ctx.reply("Sizning telegram id: "+ ctx.from.id)
})





























bot.filter(hears("register_btn_text"), async (ctx) => {
    await clear_seasion_data(ctx)
    await ctx.conversation.enter("register_anketa_conversation");
});

bot.filter(hears("cancel_action_btn_text"), async (ctx) => {
    await ctx.conversation.enter("menu_conversation");
});
bot.filter(hears("no_have_child"), async (ctx) => {
    await anketa_list(ctx)
});
bot.filter(hears("refull_anketa_btn_text"), async (ctx) => {
    await clear_seasion_data(ctx)
    await ctx.conversation.enter("register_anketa_conversation");
});




bot.filter(hears("confirm_anketa_btn_text"), async (ctx) => {
    let candidate = ctx.session.session_db.condidate;
    let hw = ctx.session.session_db.husband_woman;
    let children_list = ctx.session.session_db.children_list;
    let exist_user = await user_info(ctx.from.id)

    if (candidate.fullname && candidate.marital_status && exist_user) {
        let data = {
            client_id: exist_user._id,
            client_tg_id: ctx.from.id,
            full_name: candidate.fullname,
            birthday: candidate.birthday,
            picture: candidate.picture,
            pasport: candidate.pasport,
            live_adress: candidate.live_adress,
            birth_adress: candidate.birth_adress,
            phone: candidate.phone,
            education: candidate.education,
            marital_status: candidate.marital_status,
        }
        if (candidate.marital_status == ctx.t("marital_2")) {
            data.husband_woman = hw
        }

        if (candidate.marital_status !== ctx.t("marital_1")) {
            data.children_list = children_list
        }


        let order = await register_order(data);
        await ctx.reply(ctx.t("payment_ticket_text", {
            order_number: order.order_number,
            order_date: order.created_at,
            service_price: SERVICE_PRICE,
            card_number: CARD_NUMBER,
            card_owner: CARD_OWNER,
        }), {
            parse_mode: "HTML"
        })
        await data_sender(ctx, data)
        await ctx.conversation.enter("menu_conversation");


    } else {
        await ctx.reply(ctx.t("expire_message_text"), {
            parse_mode: "HTML"
        })
        await ctx.conversation.enter("menu_conversation");
    }

});












bot.filter(hears("guid_btn_text"), async (ctx) => {
    let lang = await ctx.i18n.getLocale();
    await guide_video(ctx, lang)

});

bot.filter(hears("call_center_btn_text"), async (ctx) => {
    await ctx.reply(ctx.t("contact_phone_text"), {
        parse_mode: "HTML"
    })
});


const check_menu_btn = new Menu("check_menu_btn")
    .dynamic(async (ctx, range) => {
        let list = await check_orders(ctx.from.id);
        list.forEach((item) => {
            range
                .text(item.order_number, async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.deleteMessage();
                    ctx.session.session_db.selected_check = item;
                    await ctx.conversation.enter("send_paymentcheck_conversation");
                })
                .row();
        })
    })
pm.use(check_menu_btn)


bot.filter(hears("ticket_payment_btn_text"), async (ctx) => {
    let list = await check_orders(ctx.from.id);
    if(list.length>0){
        await ctx.reply(ctx.t("check_order_send_text"), {
            parse_mode: "HTML",
            reply_markup: check_menu_btn,
        })
    }else{
        await ctx.reply(ctx.t("no_anketa_text"), {
            parse_mode: "HTML"
        })
    }
   
});

const status_text = (active, payment, finished, lang) => {
    if (!active) {
        return lang == 'uz' ? "Rad etilgan ❌" : "Отклонено ❌"
    } else if (!payment) {
        return lang == 'uz' ? "To'lov kutilmoqda ⏳" : "Ожидается оплата ⏳"
    } else if (!finished) {
        return lang == 'uz' ? "Bajarilishi kutilmoqda ⏳" : "Жду завершения ⏳"
    } else if (finished) {
        return lang == 'uz' ? "Ro'yhatga olindi ✅" : " Зарегистрирован ✅"
    }

}

bot.filter(hears("my_anketa_btn_text"), async (ctx) => {
    let lang = await ctx.i18n.getLocale();
    let orders = await my_orders(ctx.from.id);
    if (orders.length > 0 && lang == 'uz') {
        let my_order_text = `<b>📨 Mening anketalarim</b>`

        for (let i = 0; i < orders.length; i++) {
            let anketa = orders[i];
            let text = `

✉️ Anketa raqami: <b>${anketa.order_number}</b>
🕤 Anketa sanasi: <b>${new Date(anketa.created_at).toLocaleString()}</b>
💰 To'lov holati: <b>${anketa.is_payment ? "To'lov qilingan ✅" : "To'lov qilinmagan ❌"}</b>
📌 Anketa holati: <b>${status_text(anketa.active, anketa.is_payment, anketa.is_finished, lang)}</b>
📍 Sababi: <b>${anketa.ban_reason || ''}</b>`
            my_order_text = my_order_text + text
        }


        await ctx.reply(my_order_text, {
            parse_mode: "HTML"
        })
    } else if (orders.length > 0 && lang == 'ru') {

        let my_order_text = `<b>📨 Мои анкеты</b>`

        for (let i = 0; i < orders.length; i++) {
            let anketa = orders[i];
            let text = `

✉️ Номер заявления: <b>${anketa.order_number}</b>
🕤 Дата подачи документов: <b>${new Date(anketa.created_at).toLocaleString()}</b>
💰 Статус платежа: <b>${anketa.is_payment ? "Оплаченный ✅" : "Не оплачен ❌"}</b>
📌 Статус анкеты: <b>${status_text(anketa.active, anketa.is_payment, anketa.is_finished, lang)}</b>
📍 Причина: <b>${anketa.ban_reason || ''}</b>`
            my_order_text = my_order_text + text
        }


        await ctx.reply(my_order_text, {
            parse_mode: "HTML"
        })

    }
    else {
        await ctx.reply(ctx.t("no_anketa_text"), {
            parse_mode: "HTML"
        })
    }
});







module.exports = bot 