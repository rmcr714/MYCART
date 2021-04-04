import express from 'express'

//middlewares
import { authCheck } from '../middlewares/auth.js'
import { userCart, getUserCart } from '../controllers/userController.js'

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)

export default router
