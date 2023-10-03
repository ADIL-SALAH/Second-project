const express = require('express')
const { restoRegister, restoLogin, addCategory, categoryList, addMenu, forgotPassword, dishList, deleteCategory, deleteMenu, editMenu, getProfile, updateLogo, loadOrderMgt, editCategory, saveAddress, resetPassword, addPhotos, deletePhotos, getOrderDetails, getChatUsersList, getChatList, acceptOrder } = require('../controller/restoController')
const router = express.Router()
const { validateToken } = require('../middlewares/Auth')
const { isPermissionGranded } = require('../middlewares/isBlocked')
var multer = require('multer');
const path = require('path')



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


router.post('/signup', restoRegister)
router.post('/', restoLogin)
router.get('/forgotPassword', forgotPassword)
router.put('/resetPassword', resetPassword)
router.post('/addCategory', validateToken, isPermissionGranded, addCategory)
router.post('/editCategory', validateToken, isPermissionGranded, editCategory)
router.get('/category', validateToken, isPermissionGranded, categoryList)
router.get('/deleteCategory', validateToken, isPermissionGranded, deleteCategory)
router.post('/addMenu', validateToken, isPermissionGranded, imageUpload.array('images', 4), addMenu)
router.get('/deleteMenu', validateToken, isPermissionGranded, deleteMenu)
router.post('/editMenu', validateToken, isPermissionGranded, imageUpload.array('images', 4), editMenu)
router.get('/dishes', validateToken, isPermissionGranded, dishList)
router.get('/restoProfile', validateToken, isPermissionGranded, getProfile)
router.post('/updateLogo', validateToken, isPermissionGranded, imageUpload.single('file'), updateLogo)
router.get('/orderMgt', validateToken, isPermissionGranded, loadOrderMgt)
router.post('/saveAddress', validateToken, isPermissionGranded, saveAddress)
router.post('/addPhotos', validateToken, isPermissionGranded, imageUpload.single('file'), addPhotos)
router.delete('/deletePhoto', validateToken, isPermissionGranded, deletePhotos)
router.get('/orderDetails', validateToken, isPermissionGranded, getOrderDetails)
router.get('/fetchChatUsersList', validateToken, isPermissionGranded, getChatUsersList)
router.get('/chatList', validateToken, isPermissionGranded, getChatList)
router.put('/acceptOrder', validateToken, isPermissionGranded, acceptOrder)
module.exports = router