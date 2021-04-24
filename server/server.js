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
import productRoutes from './routes/product.js'
import couponRoutes from './routes/coupon.js'
import stripeRoutes from './routes/stripe.js'
import cloudinary from './routes/cloudinary.js'

//db
connectDB()

//app
const app = express()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

//Routes middleware
app.use(
  '/api',
  authRoutes,
  userRoutes,
  categoryRoutes,
  subRoutes,
  productRoutes,
  couponRoutes,
  stripeRoutes,
  cloudinary
)

//port
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server started on port ${port}`.cyan)
})
