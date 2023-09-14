
const {Order} = require("../models/orderModels");
const customLogger = require("../config/customLogger");

const register_order = async(data)=>{
    try{
        let order_count = await Order.countDocuments({});
        data.order_number = order_count + 1;
        return await Order.create(data);

    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const my_orders = async(client_tg_id)=>{
    try{
        return await Order.find({client_tg_id})
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const check_orders = async(client_tg_id)=>{
    try{
        return await Order.find({client_tg_id, active:true})
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}



module.exports = {register_order, my_orders, check_orders}
