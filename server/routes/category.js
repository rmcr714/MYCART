import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'

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
router.get('/categories', list)
router.get('/category/:slug', read)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)

//Route for fetching subcategories based on category
router.get('/category/subs/:_id', getSubs)

export default router
