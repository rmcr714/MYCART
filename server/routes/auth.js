import express from 'express'
const router = express.Router()

//middlewares
import { authCheck } from '../middlewares/auth.js'

//controller
import {
  createOrUpdateUser,
  currentUser,
} from '../controllers/authController.js'

router.post('/create-or-update-user', authCheck, createOrUpdateUser)
router.post('/current-user', authCheck, currentUser)

export default router
