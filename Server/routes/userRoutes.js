const express = require('express')
const router = express.Router()
const { userRegistration, userLogin, isDuplicateUser, forgotPassword, resetPassword, getRestoList, like, getRestaurantView, menuList, orderDish, userProfile, razorpayCreateOrder, razorpayVerify, searchRestaurants, addPhoto, myOrders, createChatRoom, orderSuccess, orderCancel, } = require('../controller/userController');
const { validateToken } = require('../middlewares/Auth');
const { isBlocked } = require('../middlewares/isBlocked');
const multer = require('multer');
const path = require('path');
const { getChatList } = require('../controller/restoController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const imageUpload = multer({
    storage: storage
})

router.get('/restos', getRestoList)

router.post('/isDuplicateUser', isDuplicateUser)
router.post('/signup', userRegistration)
router.post('/login', userLogin)
// router.get('/validateToken', validateToken)
router.get('/forgotPassword', forgotPassword)
router.put('/resetPassword', resetPassword)
router.put('/like', validateToken, like)
router.get('/restaurantView', getRestaurantView)
router.get('/menuList', menuList)
router.post('/orderDish', validateToken, orderDish)
router.get('/userProfile', validateToken, userProfile)
router.post('/createOrder', razorpayCreateOrder)
router.post('/verifyRazorpay', razorpayVerify)
router.get('/search', validateToken, searchRestaurants)
router.post('/addPhoto', validateToken, imageUpload.single('file'), addPhoto)
router.get('/MyOrders', validateToken, myOrders)
router.get('/chatRoomCreate', validateToken, createChatRoom)
router.get('/chatList', validateToken, getChatList)
// router.get('/orderSuccess', validateToken, orderSuccess)
router.put('/orderCancel', validateToken, orderCancel)



module.exports = router
