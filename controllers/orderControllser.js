
const { Order } = require("../models/orderModels");
const customLogger = require("../config/customLogger");
const { User } = require("../models/UserModels")

const register_order = async (data) => {
    try {
        let order_count = await Order.countDocuments({});
        data.order_number = order_count + 1;
        return await Order.create(data);

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const my_orders = async (client_tg_id) => {
    try {
        return await Order.find({ client_tg_id })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const check_orders = async (client_tg_id) => {
    try {
        return await Order.find({ client_tg_id, active: true, is_payment: false })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const check_payments = async () => {
    try {
        return await Order.find({ is_payment: false, active: true })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const confirm_payment_order = async (id) => {
    try {
        await Order.findByIdAndUpdate(id, {
            is_payment: true,

        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const reject_order = async (data) => {

    try {
        await Order.findByIdAndUpdate(data._id, {
            active: false,
            ban_reason: data.ban_reason,
            admin_id: data.admin_id,
        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const cheked_payment_orders = async () => {
    try {
        return await Order.find({ is_payment: true, active: true, is_finished: false })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const my_check_payment_orders = async (user_id) => {
    try {
        return await Order.find({ fastening_admin: user_id, is_payment: true, active: true, is_finished: false, })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const finished_order = async (data) => {
    try {
        return await Order.findByIdAndUpdate(data._id, {
            is_finished: true,
            confirmation_text: data.confirmation_text,
            admin_id: data.admin_id,
        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}
const finished_order_by_picture = async (data) => {
    try {
        return await Order.findByIdAndUpdate(data._id, {
            is_finished: true,
            confirmation_picture: data.confirmation_picture,
            admin_id: data.admin_id,
        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const free_orders = async () => {
    try {
        return await Order.find({ is_payment: true, active: true, is_finished: false, fastening_admin: null, })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const fastenish_orders = async (data) => {
    try {
        let free_orders = await Order.find({ is_payment: true, active: true, is_finished: false, fastening_admin: null, });
        let status = true
        for (const order of free_orders) {

            if (status) {
                console.log(order.order_number);
                await Order.findByIdAndUpdate(order._id, {
                    fastening_admin: data.admin_id,
                });

                if (order.order_number == data.order_number) {
                    status = false;
                }

            }
        }

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const general_statistic = async () => {
    try {
        let all_orders = await Order.find({});
        let all_users = await User.find({ active: true }).countDocuments({});
        let all_count = all_orders.length;
        let rejected_count = all_orders.filter(item => !item.active).length;
        let payment_count = all_orders.filter(item => item.is_payment).length;
        let registered_count = all_orders.filter(item => !item.is_finished).length;

        return {
            all_count,
            rejected_count,
            payment_count,
            registered_count,
            all_users
        }

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const today_statistic = async () => {
    try {
        let today = new Date().toLocaleDateString("sv-SE");
        const startDate = new Date(today);
        const endDate = new Date(today);
        endDate.setDate(startDate.getDate() + 1);
        let all_orders = await Order.find({
            created_at: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        let all_count = all_orders.length;
        let rejected_count = all_orders.filter(item => !item.active).length;
        let payment_count = all_orders.filter(item => item.is_payment).length;
        let registered_count = all_orders.filter(item => !item.is_finished).length;

        return {
            all_count,
            rejected_count,
            payment_count,
            registered_count,
        }



    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}





const set_document_fields = async () => {
    try {

        // await Order.updateMany({}, {
        //     $set: { "fastening_admin": null }
        // })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}






module.exports = { register_order, my_check_payment_orders, my_orders, general_statistic,today_statistic, check_orders, check_payments, confirm_payment_order, reject_order, cheked_payment_orders, finished_order, finished_order_by_picture, set_document_fields, free_orders, fastenish_orders }
