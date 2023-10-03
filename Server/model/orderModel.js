const mongoose = require('mongoose')
const { Schema, model } = mongoose

const orderSchema = new Schema({
    orderId: {
        type: String,
        require: true
    },
    customer: {
        type: String,
        require: true
    },
    restaurant: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'Resto'
    },
    items: {
        type: Array,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    orderDate: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        require: true
    },
    deliveryMode: {
        type: String,
        require: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    }

})

const order = model('orders', orderSchema)

module.exports = order