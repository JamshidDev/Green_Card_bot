const { Payment } = require("../models/paymentModal")
const customLogger = require("../config/customLogger");


const register_payment = async (data) => {
    try {
        return await Payment.create(data);

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const order_payment_check = async (order_id) => {
    try {
        return await Payment.find({ order_id, active: true });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const reject_payment_check = async (id) => {
    try {
        await Payment.findByIdAndUpdate(id, {
            active: false,

        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const confirm_payment_check = async (id) => {
    try {
        await Payment.findByIdAndUpdate(id, {
            confirm_payment: true,

        });
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

// const delete_all_orders = async () => {
//     try {

//         await Payment.deleteMany({})
//     } catch (error) {
//         customLogger.log({
//             level: 'error',
//             message: error
//         });
//     }
// }

// delete_all_orders()


module.exports = {
    register_payment,
    order_payment_check,
    reject_payment_check,
    confirm_payment_check
}