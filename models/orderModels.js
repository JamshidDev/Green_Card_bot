const mongoose = require("mongoose");


const order_schema = mongoose.Schema({
    order_number:{
        type: Number,
        required: true,
    },
    client_id:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    client_tg_id:{
        type: Number,
        required: true,
    },
    full_name:{
        type: String,
        required: true,
    },
    birthday:{
        type: String,
        required: true,
    },
    picture:{
        type: [Object],
        required: true,
    },
    pasport:{
        type: [Object],
        default:null,
    },
    live_adress:{
        type: String,
        required: true,
    },
    birth_adress:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    education:{
        type: String,
        required: true,
    },
    marital_status:{
        type: String,
        required: true,
    },
    children_list:{
        type: [Object],
        default:null,
    },
    husband_woman:{
        type:Object,
        default:null,
    },

    // logical
    is_payment:{
        type:Boolean,
        default:false
    },
    // finished anketa
    is_finished:{
        type:Boolean,
        default:false
    },
    // ban anketa
    active:{
        type:Boolean,
        default:true
    },
    // ban reason
    ban_reason:{
        type:String,
        default:null
    },
    // confirmetion text
    confirmation_text:{
        type:String,
        default:null

    },
    // confirmetion picture
    confirmation_picture:{
        type: [Object],
        default:null,
    },
    // responsible user
    admin_id:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default:null
    },
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})


const Order = mongoose.model("Order", order_schema);

module.exports = {Order}