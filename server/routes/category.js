import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'
import {
  listAllCategoryCache,
  categoryProductCache,
} from '../middlewares/categoryCache.js'

//controller
import {
  create,
  list,
  read,
  update,
  remove,
  getSubs,
} from '../controllers/categoryController.js'

//routes
router.post('/category', authCheck, adminCheck, create)
router.get('/categories', listAllCategoryCache, list)
router.get('/category/:slug', categoryProductCache, read)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)

//Route for fetching subcategories based on category
router.get('/category/subs/:_id', getSubs)

export default router
