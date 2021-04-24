import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Coupon from '../models/couponModel.js'
import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET)

export const createPaymentIntent = async (req, res) => {
  try {
    const { couponApplied } = req.body
    console.log(couponApplied)

    const stripe = new Stripe(process.env.STRIPE_SECRET)

    //1. Get the user
    const user = await User.findOne({ email: req.user.email }).exec()

    //2 get the cart
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    }).exec()

    let finalAmount = 0
    if (couponApplied && totalAfterDiscount > 0) {
      finalAmount = totalAfterDiscount * 100
    } else {
      finalAmount = cartTotal * 100
    }

    console.log(cartTotal, totalAfterDiscount)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'inr',
    })

    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    })
  } catch (err) {
    console.log(err)
  }
}
