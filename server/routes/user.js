import express from 'express'

//middlewares
import { authCheck } from '../middlewares/auth.js'
import {
  userCart,
  getUserCart,
  saveAddress,
  deleteAddress,
} from '../controllers/userController.js'

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/deleteaddress', authCheck, deleteAddress)

export default router
