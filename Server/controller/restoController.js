
const restoSchema = require('../model/restoModel')
const orderSchema = require('../model/orderModel')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinaryConfig = require('../clodudinaryConfig')
const uploader = require('cloudinary').v2
const fs = require('fs')
const path = require('path')
const order = require('../model/orderModel')
const chatSchema = require('../model/chatModel')


const restoRegister = async (req, res, next) => {
    try {
        const { name, username, phone, password } = req.body
        isResto = await restoSchema.findOne({ phone: phone })
        const encryptedPassword = await bcrypt.hash(password, 10)
        if (!isResto) {
            restoSchema.create({
                username: username,
                resto_name: name.toUpperCase(),
                password: encryptedPassword,
                phone: phone
            })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'user already existed' })
        }
    } catch (error) {
        res.json({
            success: false, error: error
        })
    }
}

const restoLogin = async (req, res, next) => {
    try {
        const { phone, password } = req.body
        const isResto = await restoSchema.findOne({ phone: phone })
        if (isResto) {
            const isPwdMatch = await bcrypt.compare(password, isResto.password)

            if (isPwdMatch) {
                let jwtSecretKey = process.env.JWT_SECRET_KEY
                let data = {
                    phone: isResto.phone,
                    name: isResto.resto_name,
                    password: isResto.password,
                    permission: isResto.permission
                }
                const token = jwt.sign(data, jwtSecretKey)
                if (isResto.permission === true) {
                    res.json({ success: true, token, restoName: isResto.resto_name, phone: isResto.phone, logo: isResto.logo, objId: isResto._id })
                } else {
                    res.json({
                        success: false, error: 'permission not granted'
                    })
                }
            } else {
                res.json({ success: false, error: 'password' })
            }
        } else {
            res.json({ success: false, error: 'phone' })
        }
    } catch (error) {
        console.log(error)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const phone = req.query.phone
        const isResto = await restoSchema.findOne({ phone: phone })
        if (isResto) {
            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, phone } = req.body
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatePassword = await userSchema.updateOne({ phone: phone }, { $set: { password: encryptedPassword } })
        updatePassword ? res.json({ success: true }) : res.json({ success: false })
    } catch (error) {
        res.status(500)
    }
}


const addCategory = async (req, res, next) => {
    try {
        let { categoryName, description, objId } = req.body
        categoryName = categoryName.toUpperCase()
        const isRestaurant = await restoSchema.findOne({ _id: objId })
        const isCategory = isRestaurant.categories.some((category) => category.categoryName === categoryName)
        if (!isCategory) {
            isRestaurant.categories.push({ categoryName, description })
            await isRestaurant.save()
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Duplicate category' })
        }
    } catch (error) {
        res.json({ success: false, error: error })
    }
}

const editCategory = async (req, res, next) => {
    try {
        const { categoryName, description, id } = req.body
        const { phone } = req.user
        const isDuplicate = await restoSchema.findOne({ phone: phone, 'categories.categoryName': categoryName.toUpperCase() })
        if (!isDuplicate) {
            const updateCatefory = await restoSchema.updateOne({ phone: phone, 'categories._id': id },
                {
                    $set: {
                        'categories.$.categoryName': categoryName.toUpperCase(),
                        'categories.$.description': description
                    }
                })

            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Category already Exist' })
        }



    } catch (error) {
        res.status(500)
    }
}

const categoryList = async (req, res, next) => {
    try {
        const phone = req.user.phone
        const restaurant = await restoSchema.findOne({ phone: phone })
        const categories = restaurant.categories
        res.json({ categories: categories })
    } catch (error) {
        console.log(error)
        res.json({ error: 'Server error' })
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.query
        const phone = req.user.phone
        dishes = await restoSchema.find({ phone: phone })
        const isDishesHave = dishes[0].dishes.filter((dish) => {
            return dish.category === categoryName.toUpperCase()
        })


        if (isDishesHave.length === 0) {
            await restoSchema.updateOne({ phone: phone }, { $pull: { categories: { categoryName: categoryName } } })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'This category contains dishes.' })
        }

    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const addMenu = async (req, res, next) => {
    try {
        let { dishName, dishCategory, dishPrice, description } = req.body;

        let images = req.files.map(file => file.path); // Simplified images extraction

        const uploadPromises = images.map(image => {
            return uploader.uploader.upload(image, {
                folder: 'images',
            });
        });

        const uploadedResults = await Promise.all(uploadPromises); // Wait for all uploads to finish

        const imgUrls = uploadedResults.map(result => result.secure_url); // Extract secure URLs

        dishName = dishName.toUpperCase();
        const restophone = req.user.phone;
        const isRestaurant = await restoSchema.findOne({ phone: restophone });
        const isDuplicate = isRestaurant.dishes.some(dish => dish.dishName === dishName);


        if (!isDuplicate) {
            const addDish = await restoSchema.updateOne({ phone: restophone }, {
                $push: {
                    dishes: {
                        dishName: dishName.toUpperCase(),
                        category: dishCategory,
                        price: dishPrice,
                        images: imgUrls, // Use imgUrls array
                        description: description,
                    }
                }
            });
            res.json({ success: true });
        } else {
            res.json({ success: false, error: 'Duplicate Dish' });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
};



const dishList = async (req, res, next) => {
    try {

        const phone = req.user.phone
        const restaurant = await restoSchema.findOne({ phone: phone })
        const dishList = restaurant.dishes
        res.json({ dishList: dishList })
    } catch (error) {
        console.log(error)
        res.json({ error: 'Server error' })
    }
}

const editMenu = async (req, res, next) => {
    try {
        const { id, dishName, dishCategory, dishPrice, description } = req.body
        const phone = req.user.phone
        let images = req.files.map(file => file.path)
        const uploadPromises = images.map(image => {
            return uploader.uploader.upload(image, {
                folder: 'images',
            });
        });
        const uploadedResults = await Promise.all(uploadPromises);
        const imgUrls = uploadedResults.map(result => result.secure_url)

        await restoSchema.updateOne(
            { phone: phone, 'dishes._id': id }, // Use 'dishes._id' to match the _id of the dish
            {
                $set: {
                    'dishes.$.dishName': dishName.toUpperCase(), // Use 'dishes.$.dishName' to update the specific field
                    'dishes.$.category': dishCategory,
                    'dishes.$.price': dishPrice,
                    'dishes.$.images': imgUrls,
                    'dishes.$.description': description
                }
            }
        );

        res.json({ success: true })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const deleteMenu = async (req, res, next) => {
    try {
        const dishName = req.query.dishName
        const phone = req.user.phone
        await restoSchema.updateOne({ phone: phone }, { $pull: { dishes: { dishName: dishName } } })
        res.json({ success: true })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const getProfile = async (req, res, next) => {
    try {
        const phone = req.user.phone
        const restoDetails = await restoSchema.findOne({ phone: phone })
        res.json({ success: true, restoDetails })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const updateLogo = async (req, res, next) => {
    try {
        const file = req.file
        const phone = req.user.phone
        const uploadedResults = await uploader.uploader.upload(file.path, { folder: 'images' })

        const imgUrls = uploadedResults.secure_url // Extract secure URLs
        const updateLogo = await restoSchema.updateOne({ phone: phone }, { $set: { logo: imgUrls } })
        res.json({ success: true })
    } catch (error) {
        console.log(error, 'thhhhhhhhh')
        res.status(500)
    }
}

const loadOrderMgt = async (req, res, next) => {
    try {
        const { phone } = req.user
        const restoDetails = await restoSchema.findOne({ phone: phone })
        const orders = await orderSchema.find({ restaurant: restoDetails._id }).sort({ orderDate: -1 })
        res.json({ orders })
    } catch (error) {
        res.json(error)
        console.log(error)
    }
}


const saveAddress = async (req, res, next) => {
    try {
        const { inputValue } = req.body
        const phone = req.user.phone
        const updateAddress = await restoSchema.updateOne({ phone: phone }, {
            $set: {
                address: {
                    city: inputValue.city.toUpperCase(),
                    place: inputValue.place.toUpperCase(),
                    district: inputValue.district.toUpperCase(),
                    state: inputValue.state.toUpperCase(),
                    country: inputValue.country.toUpperCase(),
                },
                location: { longitude: inputValue.longitude, latitude: inputValue.latitude },
            },

        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const addPhotos = async (req, res, next) => {
    try {
        const photo = req.file
        const phone = req.user.phone
        const restoDetails = await restoSchema.findOne({ phone: phone })
        if (restoDetails.photos.length < 6) {
            const uploadedResults = await uploader.uploader.upload(photo.path, { folder: 'images' })
            const imgUrls = uploadedResults.secure_url // Extract secure URLs
            const addPhoto = await restoSchema.updateOne({ phone: phone }, { $push: { photos: imgUrls } })
            res.json({ success: true, message: 'Photo updated successfully' })
        }
        else {
            res.json({ success: false, message: 'Please delete any photos to upload more' })
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const deletePhotos = async (req, res, next) => {
    try {
        const { photo } = req.body
        const phone = req.user.phone
        const deletePhoto = await restoSchema.updateOne({ phone: phone }, {
            $pull: {
                photos: photo
            }
        })
        res.json({ success: true, message: 'photo deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.query.orderId
        const orderDetails = await orderSchema.find({ _id: orderId })
        res.json({ orderDetails: orderDetails })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const getChatUsersList = async (req, res, next) => {
    try {
        const restoId = req.query.restoId
        const chatUsersList = await chatSchema.find({ restoId: restoId }).populate('userId')
        res.json({ chatUsersList })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const getChatList = async (req, res, next) => {
    try {
        const { restoId, userId, chatRoomId } = req.query
        if (chatRoomId) {
            const chatList = await chatSchema.findOne({ _id: chatRoomId }).populate('userId')
            res.json({ chatList: chatList.messages, chatRoomId: chatRoomId })

        } else {
            const chatList = await chatSchema.findOne({ $and: [{ userId: userId }, { restoId: restoId }] }).populate('userId')
            res.json({ chatList: chatList.messages, chatRoomId: chatList._id })
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const getNewOrder = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}



const acceptOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId
        await orderSchema.updateOne({ orderId: orderId }, { $set: { status: 'Confirmed' } })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}



module.exports = {
    restoRegister,
    restoLogin,
    forgotPassword,
    resetPassword,
    addCategory,
    categoryList,
    deleteCategory,
    addMenu,
    dishList,
    deleteMenu,
    editMenu,
    getProfile,
    updateLogo,
    loadOrderMgt,
    editCategory,
    saveAddress,
    addPhotos,
    deletePhotos,
    getOrderDetails,
    getChatUsersList,
    getChatList,
    getNewOrder,
    acceptOrder

}