const { User } = require("../models/UserModels");
const customLogger = require("../config/customLogger");




const register_user = async (data) => {
    try {
        let exist_user = await User.findOne({ user_id: data.user_id }).exec();
        if (!exist_user) {
            await User.create(data)
        } else {
            await User.findByIdAndUpdate(exist_user._id, data);
        }
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}


const remove_user = async (user_id) => {
    try {
        let exist_user = await User.findOne({ user_id }).exec();
        if (exist_user) {
            await User.findByIdAndUpdate(exist_user._id, {
                active: false,
            });
        }

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const check_user = async (user_id) => {
    try {
        return await User.findOne({ user_id, active: true })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const user_info = async (user_id) => {
    try {
        return await User.findOne({ user_id })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const set_user_lang = async (data) => {
    try {
        let exist_user = await User.findOne({ user_id: data.user_id }).exec();
        if (exist_user) {
            await User.findByIdAndUpdate(exist_user._id, {
                lang: data.lang,
            });
            return true;
        } else {
            return false
        }

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

const get_active_user_list = async () => {
    try {
        return User.find({ active: true })
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}


module.exports = {
    register_user,
    remove_user,
    check_user,
    set_user_lang,
    user_info,
    get_active_user_list,
}