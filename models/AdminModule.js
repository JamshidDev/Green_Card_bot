const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    user_id: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    }
})

const ADMIN = mongoose.model("ADMIN", adminSchema);

module.exports = { ADMIN }