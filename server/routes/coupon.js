import express from 'express'

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'
import { create, read, remove } from '../controllers/couponController.js'

const router = express.Router()

router.post('/coupon', authCheck, adminCheck, create)
router.get('/coupons', read)
router.delete('/coupon/:couponId', authCheck, adminCheck, remove)

export default router
