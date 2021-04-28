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
  orders,
  orderTracking,
  addToWishList,
  wishList,
  removeFromWishList,
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
router.get('/user/orders', authCheck, orders)

//get particular order for tracking
router.get('/user/tracking/:orderId', authCheck, orderTracking)

//wishlist routes
router.post('/user/wishlist', authCheck, addToWishList)
router.get('/user/wishlist', authCheck, wishList)
router.put('/user/wishlist', authCheck, removeFromWishList)

export default router
