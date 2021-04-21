import express from 'express'

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'
import { create } from '../controllers/couponController.js'

const router = express.Router()

router.post('/coupon', authCheck, adminCheck, create)
router.get('/coupons')
router.delete('/coupon/:couponId')

export default router
