const express = require('express')
const { adminLogin, adminHome, blockUser, unBlockUser, restaurantMgt, revokePermission, grandPermission } = require('../controller/adminController')
const router = express.Router()


router.post('/', adminLogin)
router.get('/home', adminHome)
router.patch('/blockUser', blockUser)
router.patch('/unBlockUser', unBlockUser)

router.get('/restaurant', restaurantMgt)
router.patch('/grandPermission', grandPermission)
router.patch('/revokePermission', revokePermission)

module.exports = router