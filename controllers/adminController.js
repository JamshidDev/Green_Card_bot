const {ADMIN} = require("../models/AdminModule")
const customLogger = require("../config/customLogger");



const register_admin = async(data)=>{
    try{

        let exist_admin = await ADMIN.findOne({user_id:data.user_id});
        if(!exist_admin){
            await ADMIN.create(data)
        }else{
            await ADMIN.findByIdAndUpdate(exist_admin._id,data);
        }
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}


const get_admins = async()=>{
    try{
        return await ADMIN.find({
            active:true
        })
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const remove_admin =async(id)=>{
    try{
        await ADMIN.findByIdAndUpdate(id,{
            active:false
        });
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

module.exports = {
    register_admin,
    get_admins,
    remove_admin

}