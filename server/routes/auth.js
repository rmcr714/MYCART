import express from 'express'
const router = express.Router()

//middlewares
import { authCheck } from '../middlewares/auth.js'

//controller
import { createOrUpdateUser } from '../controllers/authController.js'

router.post('/create-or-update-user', authCheck, createOrUpdateUser)

export default router
