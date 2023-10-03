const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = async (req, res, next) => {
    console.log('hhhaheeee')
    const token = req.headers.authorization
    try {
        if (token) {
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = verified
            console.log('token Validated successfully..')
            next()
        } else {
            res.json({ success: false, error: 'Token is missing' })
            console.log('token validation failed')
        }
    } catch (err) {
        console.log('token validation failed')
        res.json({
            success: false, error: 'Token Validation Failed'
        })
    }
}

module.exports = { validateToken }