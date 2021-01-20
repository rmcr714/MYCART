import express from 'express'
const router = express.Router()

//middlewares
import { authCheck } from '../middlewares/auth.js'

//controller
import { createOrUpdateUser } from '../controllers/authController.js'

router.get('/create-or-update-user', authCheck, createOrUpdateUser)

export default router
