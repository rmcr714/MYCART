import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'

//controller
import { create } from '../controllers/productController.js'

//routes
router.post('/product', authCheck, adminCheck, create)

export default router
