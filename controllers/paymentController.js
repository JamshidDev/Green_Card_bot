const {Payment} = require("../models/paymentModal")
const customLogger = require("../config/customLogger");


const register_payment = async(data)=>{
    try{
        return await Payment.create(data);

    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}


module.exports = {
    register_payment
}