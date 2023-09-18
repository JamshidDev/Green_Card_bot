const mongoose = require("mongoose");


const paymentSchema = mongoose.Schema({
    order_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Order",
    },
    client_id: {
        type: Number,
        required: true,
    },
    payment_picture: {
        type: [Object],
        required: true,
    },
    admin_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    confirm_payment: {
        type: Boolean,
        default: false,
    },
    reject_comment: {
        type: Boolean,
        default: null,
    },
    active:{
        type: Boolean,
        default: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {Payment}