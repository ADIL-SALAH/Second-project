const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    proPic: {
        type: String,
        require: true
    },
    permanent_address: [
        {
            place: {
                type: String
            },
            city: {
                type: String
            },
            district: {
                type: String
            },
            landmark: {
                type: String
            },
            pincode: {
                type: Number
            },
            state: {
                type: String
            },
            country: {
                type: String
            },

        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false,
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        require: true,
        default: 0
    }

});

const User = model('User', userSchema);
module.exports = User;