import express from 'express'

const router = express.Router()

router.get('/user', (req, res) => {
  res.json({ message: 'hey u hit the node  user route' })
})

export default router
