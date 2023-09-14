const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: String,
    lang: String,
    phone: String,
    referal_id: {
        type: Number,
        default: null,
    },
    invited_users: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

const User = mongoose.model("User", UserSchema)

module.exports = { User }