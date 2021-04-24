import express from 'express'

//middlewares
import { authCheck } from '../middlewares/auth.js'
import {
  userCart,
  getUserCart,
  saveAddress,
  deleteAddress,
  applyCouponToUserCart,
  createOrder,
  emptyCart,
} from '../controllers/userController.js'

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/deleteaddress', authCheck, deleteAddress)
router.delete('/user/cart', authCheck, emptyCart)

//coupon routes
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart)

//order routes
router.post('/user/order', authCheck, createOrder)

export default router
