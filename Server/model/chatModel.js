const mongoose = require('mongoose')
const { Schema, model } = mongoose

const chatSchema = new Schema({
    messages: [
        {
            message: {
                type: String,
                require: true,
            },
            date: {
                type: String,
                require: true
            },
            time: {
                type: String,
                require: true
            },
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Resto'
            }
        }

    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    restoId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Resto'
    }

})

const chat = model('chat', chatSchema)
module.exports = chat