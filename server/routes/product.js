import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'

//controller
import { create, listAll } from '../controllers/productController.js'

//routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll) //return only 10 products

export default router
