import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'
dotenv.config()

//import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import categoryRoutes from './routes/category.js'
import subRoutes from './routes/sub.js'

//db
connectDB()

//app
const app = express()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

//Routes middleware
app.use('/api', authRoutes, userRoutes, categoryRoutes, subRoutes)

//port
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server started on port ${port}`.cyan)
})
