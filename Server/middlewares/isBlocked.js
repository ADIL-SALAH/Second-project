const jwt = require('jsonwebtoken')
const userSchema = require('../model/userModel')
const restoSchema = require('../model/restoModel')

const isBlocked = async (req, res, next) => {
    try {

        const user = await userSchema.find({ phone: req.user.phone })
        if (user.isBlocked) {
            return res.json({ success: false, error: 'sdfsafsa' })
        }
        else {
            next()
        }
    } catch (error) {
        res.status(500)
    }
}

const isPermissionGranded = async (req, res, next) => {
    try {
        const resto = await restoSchema.findOne({ phone: req.user.phone })
        console.log(resto.permission)
        if (resto.permission != true) {
            res.json({ success: false })

        } else {
            next()
        }
    } catch (error) {
        res.status(500)
    }
}

module.exports = {
    isBlocked,
    isPermissionGranded,
}