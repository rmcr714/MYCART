import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'

dotenv.config()

//db
connectDB()

//app
const app = express()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

//Routes
app.get('/api', (req, res) => {
  res.json({ message: 'hey u hot the node api!!!' })
})

//port
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server started on port ${port}`.cyan)
})
