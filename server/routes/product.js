import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'

//controller
import {
  create,
  listAll,
  remove,
  read,
  update,
  list,
} from '../controllers/productController.js'

//routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll) //return only count number of  products
router.delete('/product/:slug', authCheck, adminCheck, remove) //remove a product
router.get('/product/:slug', read) //read a product based on slug
router.put('/product/:slug', authCheck, adminCheck, update) //update the product

router.post('/products', list) //list the products in ascending descending etc order based on the data passed in parameter

export default router
