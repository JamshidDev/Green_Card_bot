
const { Order } = require("../models/orderModels");
const customLogger = require("../config/customLogger");

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
        return await Order.find({ client_tg_id, active: true })
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

const finished_order = async (data) => {
    try {
        return await Order.findByIdAndUpdate(data._id, {
            is_finished: true,
            confirmation_text:data.confirmation_text,
            admin_id: data.admin_id,
        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}





module.exports = { register_order, my_orders, check_orders, check_payments, confirm_payment_order, reject_order, cheked_payment_orders, finished_order }
