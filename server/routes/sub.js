import express from 'express'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'
import { listAllSubsCache } from '../middlewares/subCache.js'

//controller
import {
  create,
  list,
  read,
  update,
  remove,
} from '../controllers/subController.js'

//routes
router.post('/sub', authCheck, adminCheck, create)
router.get('/subs', listAllSubsCache, list)
router.get('/sub/:slug', read)
router.put('/sub/:slug', authCheck, adminCheck, update)
router.delete('/sub/:slug', authCheck, adminCheck, remove)

export default router
