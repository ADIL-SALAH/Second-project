const bcrypt = require('bcryptjs')
const userSchema = require('../model/userModel')
const restoSchema = require('../model/restoModel')
const orderSchema = require('../model/orderModel')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const orderid = require('order-id')('key');
const Razorpay = require('razorpay')
const crypto = require('crypto');
const uploader = require('cloudinary').v2;
const chatSchema = require('../model/chatModel')


const homePage = async (req, res, next) => {
    try {

    } catch (error) {

    }
}
const isDuplicateUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body
        console.log(name, email, phone, password, 'LLKKJLJLJLJLJ')
        const isDupUser = await userSchema.findOne({ phone: phone })
        if (isDupUser) {
            res.json({ success: false })
        } else {
            res.json({ success: true })
        }

    } catch (error) {
        res.json({ success: true })
    }
}

const userRegistration = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body
        console.log(name, email, phone, password)
        const isDupUser = await userSchema.findOne({ phone: phone })
        const encryptedPassword = await bcrypt.hash(password, 10)
        console.log(isDupUser, 'pppppppppppppppppp')
        if (!isDupUser) {
            console.log('jkljljlkjljljl')
            userSchema.create({
                username: email,
                name: name.toUpperCase(),
                phone: phone,
                password: encryptedPassword
            })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'phone' })
        }
    } catch (error) {
        console.log(error)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { phone, password } = req.body
        console.log(phone, password, 'kkkkkkkkkkkkkk')
        const isUser = await userSchema.findOne({ phone: phone })
        if (isUser) {
            const isPwdMatch = await bcrypt.compare(password, isUser.password)
            console.log(isPwdMatch, '>>>>>>>>>>>>>')
            if (isPwdMatch) {
                // if (isUser.isVerified === true) {
                console.log('llklklklklklklklklklklklk')
                if (isUser.isBlocked === false) {
                    let jwtSecretKey = process.env.JWT_SECRET_KEY;
                    let data = {
                        phone: isUser.phone,
                        name: isUser.name,
                        password: isUser.password,
                        isAdmin: isUser.isAdmin
                    }
                    const token = jwt.sign(data, jwtSecretKey);
                    console.log(token, ';;;;;;;;;;;')
                    res.json({ success: true, token, phone: isUser.phone, name: isUser.name, pic: isUser.proPic, wallet: isUser.wallet, objId: isUser._id })
                } else {
                    res.json({ success: false, error: 'User is Blocked by Admin' })
                }
                // } else {
                //     res.json({ success: false, error: 'User is not Verified, please signup and verify through otp' })
                // }
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
        console.log(phone, 'oooooooooooooooo')
        const isUser = await userSchema.findOne({ phone: phone })
        if (isUser) {

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
        console.log(newPassword, phone, ')((((((((((((((')
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatePassword = await userSchema.updateOne({ phone: phone }, { $set: { password: encryptedPassword } })
        updatePassword ? res.json({ success: true }) : res.json({ success: false })
    } catch (error) {
        res.status(500)
    }
}

const getRestoList = async (req, res, next) => {
    try {
        const restoList = await restoSchema.find({})
        res.json({ restoList })
    } catch (error) {
        res.status(500)
    }
}


const like = async (req, res, next) => {
    try {
        const restoPhone = req.query.restoPhone
        const userPhone = req.user.phone
        console.log(restoPhone)
        const isDup = await restoSchema.findOne({ phone: restoPhone, 'likes.userPhone': userPhone })
        console.log(isDup, 'kkkkkkkkkkkkk')
        if (!isDup) {
            await restoSchema.updateOne(
                { phone: restoPhone },
                {
                    $push: { likes: { userPhone: userPhone } },
                    $inc: { likesCount: 1 }
                });
        }
        else {
            await restoSchema.updateOne({ phone: restoPhone },
                {
                    $pull: { likes: { userPhone: userPhone } },
                    $inc: { likesCount: -1 }

                })
        }
        res.json({ success: true })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const getRestaurantView = async (req, res, next) => {
    try {
        const restoId = req.query.restoId
        const restoDetails = await restoSchema.findOne({ _id: restoId })
        if (restoDetails) {
            res.json({ restoDetails })
        }
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}


const menuList = async (req, res, next) => {
    try {
        const restaurantId = req.query.restaurantId
        const restaurantDetails = await restoSchema.findOne({ _id: restaurantId })
        const { dishes } = restaurantDetails
        console.log(dishes, 'qwertyuioooooooo')
        res.json({ dishes, restaurantDetails })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const orderDish = async (req, res, next) => {
    try {
        const { cart, cartTotal, cartDishDetails, restaurantId, phone, paymentMode, deliveryMode } = req.body
        console.log(cart, cartTotal, cartDishDetails, restaurantId, phone, paymentMode, deliveryMode, 'UUUUUUUUUUUUUUUUUU')
        // const cartDishDetails = dishes?.filter((dish) => {
        //     return cart.some((item) => item.item === dish._id);
        // });
        const orderUpdate = cartDishDetails.map((obj) => {
            const cartItem = cart.find((item) => item.item === obj._id)
            if (cartItem) {
                return { ...obj, qnty: cartItem.qnty }
            }
        })
        const createdOrderId = orderid.generate()

        console.log(orderUpdate, '66666666666')
        console.log(cart, cartDishDetails, 'orderid created')
        orderSchema.create({
            orderId: createdOrderId,
            customer: phone,
            restaurant: restaurantId,
            items: orderUpdate,
            amount: cartTotal,
            orderDate: Date.now(),
            paymentMode: paymentMode,
            deliveryMode: deliveryMode,
            paymentStatus: paymentMode === 'Online' || paymentMode === 'Wallet' ? 'Recieved' : 'Pending'

        })

        if (paymentMode === 'Wallet') {
            await userSchema.updateOne({ phone: phone }, { $inc: { wallet: -(cartTotal) } })
            const userDetail = await userSchema.findOne({ phone: phone })
            res.json({ success: true, message: 'order updated successfully', wallet: userDetail.wallet, orderId: createdOrderId })
        } else {
            res.json({ success: true, message: 'order updated successfully', orderId: createdOrderId })

        }
    } catch (error) {
        res.status(500)
    }
}

const userProfile = async (req, res, next) => {
    try {
        const userPhone = req.user.phone
        const userDetails = await userSchema.find({ phone: userPhone })
        console.log(userPhone, userDetails, 'oooooooooooooooooo')
        res.json({ userDetails })
    } catch (error) {
        res.json(500)
    }
}


const razorpayCreateOrder = async (req, res, next) => {
    try {
        const { cart, cartTotal, dishes, restaurantId, phone, paymentMode } = req.body;
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        instance.orders.create({
            amount: cartTotal * 100, // Amount in paise (100 paise = ₹1)
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        }, (error, order) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ message: 'something went wrong!' })
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const razorpayVerify = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const sign = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")
        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "payment Verified successfully" })
        } else {
            return res.status(400).json({ message: "invalid signature sent" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


const searchRestaurants = async (req, res, next) => {
    try {
        const input = req.query.data
        console.log(input, '00000000000000')
        // const res = await restoSchema.find({ $text: { $search: `.*${input}.*` } })
        if (input != '') {

            const results = await restoSchema.find({
                $or: [
                    { 'categories.categoryName': { $regex: `.*${input}.*`, $options: 'i' } },
                    { 'dishes.dishName': { $regex: `.*${input}.*`, $options: 'i' } },
                    { resto_name: { $regex: `.*${input}.*`, $options: 'i' } },
                    { 'address.city': { $regex: `.*${input}.*`, $options: 'i' } },
                    { 'address.place': { $regex: `.*${input}.*`, $options: 'i' } },
                    { 'address.district': { $regex: `.*${input}.*`, $options: 'i' } }
                ]
            });
            console.log(results, '99999')
            res.status(200).json({ success: true, searchResults: results })

        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const addPhoto = async (req, res, next) => {
    try {
        const file = req.file
        const phone = req.user.phone
        const uploadResult = await uploader.uploader.upload(file.path, { folder: 'images' })
        const imgUrls = uploadResult.secure_url
        const updateProfile = await userSchema.updateOne({ phone: phone }, { $set: { proPic: imgUrls } })
        res.json({ success: true, photo: imgUrls })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const myOrders = async (req, res) => {
    try {
        const phone = req.user.phone
        const orderDetails = await orderSchema.find({ customer: phone }).sort({ orderDate: -1 }).populate('restaurant')
        res.json({ success: true, orderDetails })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const createChatRoom = async (req, res, next) => {
    try {
        const { restoId, userId } = req.query
        const chatList = await chatSchema.findOne({ $and: [{ userId: userId }, { restoId: restoId }] });
        if (!chatList) {
            await chatSchema.create({
                userId: userId,
                restoId: restoId
            })
        }
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

// const orderSuccess = async (req, res) => {
//     try {
//         const orderId = req.query.orderId
//         const orderDetails = await orderSchema.findOne({ orderId: orderId }).populate('restaurant')
//         res.json({ success: true, orderDetails })

//     } catch (error) {
//         console.log(error)
//         res.status(500)
//     }
// }

const orderCancel = async (req, res) => {
    try {
        const { id, phone } = req.query
        const orderUpdate = await orderSchema.updateOne({ _id: id }, { $set: { status: 'Cancelled' } })
        const orderDetails = await orderSchema.findOne({ _id: id })
        if (orderDetails.paymentStatus === 'Recieved') {
            await userSchema.updateOne({ phone: phone }, { $inc: { wallet: orderDetails.amount } })
            await orderSchema.updateOne({ _id: id }, { $set: { paymentStatus: 'Returned to wallet' } })

        } else {
            await orderSchema.updateOne({ _id: id }, { $set: { paymentStatus: 'Not Recieved' } })
        }
        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false })
    }
}


module.exports = {
    userRegistration,
    userLogin,
    isDuplicateUser,
    forgotPassword,
    resetPassword,
    getRestoList,
    like,
    getRestaurantView,
    menuList,
    orderDish,
    userProfile,
    razorpayCreateOrder,
    razorpayVerify,
    searchRestaurants,
    addPhoto,
    myOrders,
    createChatRoom,
    // orderSuccess,
    orderCancel
}