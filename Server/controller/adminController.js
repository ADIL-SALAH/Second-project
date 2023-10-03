const mongoose = require('mongoose')
const userSchema = require('../model/userModel')
const restoSchema = require('../model/restoModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();


const adminLogin = async (req, res, next) => {
    try {
        const { phone, password } = req.body
        const isUser = await userSchema.findOne({ phone: phone })
        if (isUser) {
            const isPwdMatch = await bcrypt.compare(password, isUser.password)
            if (isPwdMatch) {
                if (isUser.isAdmin === true) {
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
                        res.json({ success: true, token, phone: isUser.phone, name: isUser.name, pic: isUser.proPic })
                    } else {
                        res.json({ success: false, error: 'User is Blocked by Admin' })
                    }
                } else {
                    res.json({ success: false, error: 'user is not an admin' })
                }
            } else {
                res.json({ success: true, error: 'password' })
            }
        } else {
            res.json({ success: false, error: 'Not an User' })
        }
    } catch (err) {
        console.log(err)
    }

}


const adminHome = async (req, res, next) => {
    try {
        console.log('haai')
        const users = await userSchema.find({})
        if (users) {
            res.json({ success: true, userDetails: users })
        }
    } catch (error) {
        res.json({ success: false })
    }
}

const blockUser = async (req, res, next) => {
    try {
        const phone = req.query.phone
        console.log(phone)
        await userSchema.updateOne({ phone: phone }, { $set: { isBlocked: true } })
        const userDetails = await userSchema.find({})
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}
const unBlockUser = async (req, res, next) => {
    try {
        const phone = req.query.phone
        console.log(phone)
        await userSchema.updateOne({ phone: phone }, { $set: { isBlocked: false } })
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })

    }
}

const restaurantMgt = async (req, res, next) => {
    try {
        console.log('haai')
        const restos = await restoSchema.find({})
        if (restos) {
            res.json({ success: true, restaurantDetails: restos })
        }
    } catch (error) {
        res.json({ success: false })
    }
}
const grandPermission = async (req, res, next) => {
    try {
        const phone = req.query.phone
        console.log(phone)
        await restoSchema.updateOne({ phone: phone }, { $set: { permission: true } })
        res.json({ success: true })
    } catch (error) {
        console.log('opopopopopo')
        res.json({ success: false })
    }
}
const revokePermission = async (req, res, next) => {
    try {
        const phone = req.query.phone
        console.log(phone)
        await restoSchema.updateOne({ phone: phone }, { $set: { permission: false } })
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}



module.exports = {
    adminLogin,
    adminHome,
    blockUser,
    unBlockUser,
    restaurantMgt,
    grandPermission,
    revokePermission
}