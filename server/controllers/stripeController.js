import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Coupon from '../models/couponModel.js'
import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET)

export const createPaymentIntent = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000,
      currency: 'inr',
    })

    res.send({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.log(err)
  }
}
