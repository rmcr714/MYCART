import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'

//controller
import { create, listAll, remove } from '../controllers/productController.js'

//routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll) //return only count number of  products
router.delete('/product/:slug', authCheck, adminCheck, remove)

export default router
