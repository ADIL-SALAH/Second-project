const mongoose = require('mongoose')
const { Schema, model } = mongoose

const restoSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    resto_name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        default: null,
        require: true
    },
    permission: {
        type: Boolean,
        default: false,
        require: true
    },
    address: {
        city: {
            type: String,
            require: true
        },
        district: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        country: {
            type: String,
            require: true
        },
        landmark: {
            type: String,
            require: true
        },
        pincode: {
            type: String,
            require: true
        },
        place: {
            type: String,
            require: true
        },

    },
    comments: [
        {
            comment: {
                type: String,
                require: true
            },
            user: {
                type: String,
                require: true
            },
            date: {
                type: Date,
                require: true
            }
        }
    ],
    photos: [
        {
            type: String,
            require: true
        }
    ],
    location: {
        type: Object,
        require: true
    },
    likes: [
        {
            userPhone: {
                type: String,
                require: true
            }
        }
    ],
    likesCount: {
        type: Number,
        default: 0,
        require: true
    },
    premium: {
        type: Boolean,
        default: false,
        require: true
    },
    dishes: [
        {
            dishName: {
                type: String,
                require: true
            },
            description: {
                type: String,
                require: true
            },
            category: {
                type: String,
                require: true
            },
            price: {
                type: String,
                require: true
            },
            images: {
                type: Array,
                require: true
            }
        }
    ],
    categories: [
        {
            categoryName: {
                type: String,
                require: true
            },
            description: {
                type: String,
                require: true
            }
        }
    ],
    tableNos: {
        type: Number,
        require: true
    },
    openingTime: {
        type: String,
        require: true
    },
    closingTime: {
        type: String,
        require: true
    }


})
restoSchema.index({ 'address.city': "text", 'address.place': "text", 'address.district': "text" }, { default_language: 'english' })
const Resto = model('Resto', restoSchema)

module.exports = Resto