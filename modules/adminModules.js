const { Composer, Keyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");

const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");

// const {
//     conversations,
//     createConversation,
// } = require("@grammyjs/conversations");


const { order_payment_check, reject_payment_check, confirm_payment_check } = require("../controllers/paymentController")
const { check_payments, confirm_payment_order, reject_order, cheked_payment_orders, finished_order } = require("../controllers/orderControllser");
const { user_info } = require("../controllers/userController");

const bot = new Composer();




const pm = bot.chatType("private");

// const i18n = new I18n({
//     defaultLocale: "uz",
//     useSession: true,
//     directory: "locales",
//     globalTranslationContext(ctx) {
//         return { first_name: ctx.from?.first_name ?? "" };
//     },
// });
// bot.use(i18n);
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

    await ctx.api.sendPhoto(ctx.from.id, file_id, {
        caption: msg_text,
        parse_mode: "HTML",
    })

}

pm.use(createConversation(reject_order_conversation));
pm.use(createConversation(confirm_order_conversation));


async function reject_order_conversation(conversation, ctx) {
    await ctx.reply("Rad etish sababini yozing!")

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply("Rad etish sababini yozing!", {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }

    let message = ctx.message?.text;
    let selected_order = ctx.session.session_db.selected_payment_order
    if (selected_order) {
        let admin = await user_info(ctx.from.id);
        let data = {
            _id: selected_order._id,
            ban_reason: message,
            admin_id: admin._id
        }
        await reject_order(data);
        await ctx.reply(`✅ ${selected_order.order_number} - raqamli anketa raq etildi!`, {
            parse_mode: "HTML"
        })
        let user = await user_info(selected_order.client_tg_id);
        await ctx.i18n.setLocale(user.lang);
        await ctx.api.sendMessage(selected_order.client_tg_id, ctx.t("reject_order_text", {
            order_number: selected_order.order_number
        }), {
            parse_mode: "HTML"
        })

    } else {
        await ctx.reply("<b>⚠️ Eskirgan xabar!</b>", {
            parse_mode: "HTML"
        })
    }
    return


}

async function confirm_order_conversation(conversation, ctx){
    let order_details = ctx.session.session_db.order_details;
    
    if(!order_details){
        await ctx.reply("<b>⚠️ Eskirgan xabar!</b>", {
            parse_mode: "HTML"
        })
        return
    }
    await ctx.reply(`<b>Green card</b> confirmition texttini yozing!`, {
        parse_mode:"HTML"
    })

    ctx = await conversation.wait();

    if (!ctx.message?.text) {
        do {
            await ctx.reply("<b>Green card</b> confirmition texttini yozing!", {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text);
    }
    
    let confirmation_text = ctx.message.text;
    let user = await user_info(ctx.from.id);
    order_details = ctx.session.session_db.order_details;
    let data = {
        _id:order_details._id,
        admin_id:user._id,
        confirmation_text:confirmation_text,
    }
    await finished_order(data)
    await ctx.reply(`✅ ${order_details.order_number} - raqamli anketa muvofaqiyatli ro'yhatga olidni`)

    let client =await user_info(order_details.client_id);
    await ctx.i18n.setLocale(client.lang);
    await ctx.api.sendMessage(order_details.client_id, ctx.t("confirmation_code_text",{
        order_number:order_details.order_number,
        full_name:order_details.full_name,
        birthday:order_details.birthday,
        code:confirmation_text,
    }),{
        parse_mode:"HTML",
    })

    

}













pm.filter(async (ctx) => {
    return ctx.config.super_admin
}).command("start", async (ctx) => {
    let keyboard = new Keyboard()
        .text("✉️ Yangi Anketalar")
        .text("💰 Tasdiqlangan")
        .row()
        .text("📉 Statistika")
        .text("🟥 Rad etilgan")
        .resized()
    await ctx.reply("Salom Super Admin", {
        reply_markup: keyboard
    })
})

const payment_menu = new Menu("payment_menu")
    .text("❌ Anketani rad etish", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
        await ctx.conversation.enter("reject_order_conversation");

    })
    .row()
    .text("❌ Chekni rad etish", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
        let payment_check = ctx.session.session_db.selected_payment_check;
        let order = ctx.session.session_db.selected_payment_order;
        if (payment_check && order) {
            await reject_payment_check(payment_check._id);

            await ctx.reply(`❌ ${order.order_number} - raqamli anketaning to'lov cheki rad etildi`);
            let user = await user_info(payment_check.client_id);
            await ctx.i18n.setLocale(user.lang);
            await ctx.api.sendMessage(payment_check.client_id, ctx.t("reject_payment_check_text", {
                order_number: order.order_number
            }), {
                parse_mode: "HTML"
            })
        } else {
            await ctx.reply("<b>⚠️ Eskirgan xabar!</b>", {
                parse_mode: "HTML"
            })
        }

    })
    .row()
    .text("✅ To'lovni tasdiqlash", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
        let payment_check = ctx.session.session_db.selected_payment_check;
        let order = ctx.session.session_db.selected_payment_order;
        if (payment_check && order) {
            let payment_status = await confirm_payment_check(payment_check._id);
            let order_status = await confirm_payment_order(order._id);
            await ctx.reply(`✅ ${order.order_number} - raqamli anketa uchun to'lovni tasdiqladingiz!`);

        } else {
            await ctx.reply("<b>⚠️ Eskirgan xabar!</b>", {
                parse_mode: "HTML"
            })
        }
    })

pm.use(payment_menu)

const reject_order_menu = new Menu("reject_order_menu")
    .text("❌ Anketani rad etish", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
        await ctx.conversation.enter("reject_order_conversation");
    })
pm.use(reject_order_menu)
const payment_anketa_menu = new Menu("payment_anketa_menu")
    .dynamic(async (ctx, range) => {
        let list = await check_payments();
        list.forEach((item) => {
            range
                .text(item.order_number + " -- " + (new Date(item.created_at).toLocaleDateString()), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.deleteMessage();
                    let check_picture = await order_payment_check(item._id);
                    if (check_picture.length > 0) {
                        let picture = check_picture[check_picture.length - 1]
                        ctx.session.session_db.selected_payment_order = item;
                        ctx.session.session_db.selected_payment_check = picture;
                        await ctx.api.sendPhoto(ctx.from.id, picture.payment_picture[1].file_id, {
                            caption: `
 <b>♻️ To'lovni tekshirish</b> 
    
Anketa raqami: <b>${item.order_number}</b>
Kandidat: <b>${item.full_name}</b>
Anketa sanasi: <b>${new Date(item.created_at).toLocaleDateString()}</b>
To'lov sanasi: <b>${new Date(picture.created_at).toLocaleDateString()}</b>
                            `,
                            parse_mode: "HTML",
                            reply_markup: payment_menu,
                        })

                    } else {
                        ctx.session.session_db.selected_payment_order = item;
                        await ctx.reply(`
<b> ⚠️ To'lov cheki topilmadi</b>   

Anketa raqami: <b>${item.order_number}</b>
Kandidat: <b>${item.full_name}</b>
Anketa sanasi: <b>${new Date(item.created_at).toLocaleDateString()}</b>
                        `, {
                            parse_mode: "HTML",
                            reply_markup: reject_order_menu
                        })
                    }



                })
                .row();
        })
    })
pm.use(payment_anketa_menu)

// Payment admin start
pm.filter(async (ctx) => {
    return ctx.config.payment_admin
}).command("start", async (ctx) => {
    let keyboard = new Keyboard()
        .text("✉️ To'lovlarni tekshirish")
        .resized()
    await ctx.reply("Salom Payment Admin", {
        reply_markup: keyboard
    })
})



// Worker admin

pm.filter(async (ctx) => {
    return ctx.config.worker_admin
}).command("start", async (ctx) => {
    let keyboard = new Keyboard()
        .text("✅ Ro'yhatga olish")
        .resized()
    await ctx.reply("Salom Worker Admin", {
        reply_markup: keyboard
    })
})








bot.hears("✉️ To'lovlarni tekshirish", async (ctx) => {
    let list = await check_payments();
    if (list.length > 0) {
        await ctx.reply(`
<b>To'lovlarni tekshirish</b>

<i>Anketa raqami -- Anketa sanasi</i>
<i>Anketa ustida amal bajarish uchun ustiga bosing!</i>
        `, {
            parse_mode: "HTML",
            reply_markup: payment_anketa_menu,
        })
    } else {
        await ctx.reply("🤷🏻‍♂️ Hozira anketalar mavjud emas...")
    }

});


let register_reject_menu = new Menu("register_reject_menu")
    // .text("❌ Anketani rad etish", async (ctx) => {
    //     await ctx.answerCallbackQuery();
    //     await ctx.deleteMessage();
    //     await ctx.conversation.enter("reject_order_conversation");
    // })
    // .row()
    .text("✅ Ro'yhatga olish ( Text )", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
        await ctx.conversation.enter("confirm_order_conversation");
    })
    .row()
    .text("✅ Ro'yhatga olish ( Rasm )", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();
    })
pm.use(register_reject_menu)
const register_anketa_menu = new Menu("register_anketa_menu")
    .dynamic(async (ctx, range) => {
        let list = await cheked_payment_orders();
        list.forEach((data) => {
            range
                .text(data.order_number + " -- " + (new Date(data.created_at).toLocaleDateString()), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.deleteMessage();
                    ctx.session.session_db.order_details = {
                        _id:data._id,
                        order_number:data.order_number,
                        client_id:data.client_tg_id,
                        full_name:data.full_name,
                        birthday:data.birthday
                    };

                    let anketa_text = `
<b>🔔 Yangi ma'lumoti</b>
                   
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

                    await picture_notefication(ctx, data.picture[1].file_id, data.full_name, data.birthday, 'candidate', 0)
                    await picture_notefication(ctx, data.pasport[1].file_id, data.full_name, data.birthday, 'candidate', 0)
                    if (data.husband_woman) {
                        await picture_notefication(ctx, data.husband_woman.picture[1].file_id, data.husband_woman.fullname, data.husband_woman.birthday, 'hw', 0)
                        await picture_notefication(ctx, data.husband_woman.pasport[1].file_id, data.husband_woman.fullname, data.husband_woman.birthday, 'hw', 0)
                    }

                    if (data.children_list?.length > 0) {
                        for (let i = 0; i < data.children_list.length; i++) {
                            let child = data.children_list[i];
                            await picture_notefication(ctx, child.picture[1].file_id, child.fullname, child.birthday, 'child', child.number);
                            await picture_notefication(ctx, child.pasport[1].file_id, child.fullname, child.birthday, 'child', child.number);

                        }
                    }

                    await ctx.api.sendMessage(ctx.from.id, anketa_text, {
                        parse_mode: "HTML",
                        reply_markup:register_reject_menu,
                    })
                })
                .row();
        })
    })
pm.use(register_anketa_menu)

bot.hears("✅ Ro'yhatga olish", async (ctx) => {
    let list = await cheked_payment_orders();
    if (list.length > 0) {
        await ctx.reply(`
<b>💰 To'lov tasdiqlangan anketalar</b>

<i>Anketa raqami -- Anketa sanasi</i>
<i>Anketa ustida amal bajarish uchun ustiga bosing!</i>
        `, {
            parse_mode: "HTML",
            reply_markup: register_anketa_menu,
        })
    } else {
        await ctx.reply("🤷🏻‍♂️ Hozirda anketalar mavjud emas...")
    }

});






































































module.exports = bot 