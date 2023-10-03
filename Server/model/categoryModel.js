const mongoose = require('mongoose')
const { Schema, model } = mongoose

const categorySchema = new Schema({
    categoryName: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
})
const category = model('category', categorySchema)
module.exports = category