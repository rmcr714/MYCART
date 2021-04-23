import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Coupon from '../models/couponModel.js'

//@desc  save cart data in cart collection
//@route POST /api/user/cart
//@access private
export const userCart = async (req, res) => {
  const { cart } = req.body

  let products = []

  const user = await User.findOne({ email: req.user.email }).exec()

  //check if user already has items in cart
  let cartExist = await Cart.findOne({ orderedBy: user._id }).exec()

  if (cartExist) {
    cartExist.remove()
    console.log('removed cart data')
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {}
    object.product = cart[i]._id
    object.count = cart[i].count
    object.color = cart[i].color
    //find the price for security reasons
    let { price } = await Product.findById(cart[i]._id).select('price').exec()
    object.price = price
    products.push(object)
  }

  let totalCartPrice = 0
  for (let i = 0; i < products.length; i++) {
    totalCartPrice = totalCartPrice + products[i].price * products[i].count
  }

  let newCart = await new Cart({
    products,
    cartTotal: totalCartPrice,
    orderedBy: user._id,
  }).save()

  res.json({ ok: true })
}

//@desc  get user cart
//@route GET /api/user/cart
//@access private
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec()

    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product', '_id title price totalAfterDiscount')
      .populate('orderedBy')
      .exec()

    const { products, cartTotal, totalAfterDiscount, orderedBy } = cart

    res.json({ products, cartTotal, totalAfterDiscount, orderedBy })
  } catch (error) {
    console.log(error)
    res.json(null)
  }
}

//@desc  get user cart
//@route GET /api/user/address
//@access private
export const saveAddress = async (req, res) => {
  try {
    const { addresses } = req.body

    //find the customer
    const user = await User.findOne({ email: req.user.email }).exec()

    const addressAlreadyPresent = user.addresses.find(
      (element) => element.address.toString() == addresses.address.toString()
    )

    if (addressAlreadyPresent) {
      res.json({
        message: 'Address already present please enter a different address',
      })
    } else {
      const userAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { $push: { addresses: addresses } }
      )

      res.json({ message: 'address successfully saved' })
    }
  } catch (error) {
    console.log(error)
    res.json(null)
  }
}

//@desc  delete user address
//@route DELETE /api/user/deleteaddress
//@access private
export const deleteAddress = async (req, res) => {
  try {
    const { data } = req.body

    //find the customer
    const user = await User.findOne({ email: req.user.email }).exec()

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { addresses: { _id: data._id } } },
      {
        upsert: true,
      }
    ).exec()

    console.log(updatedUser)

    res.json({ message: 'ok' })
  } catch (error) {
    console.log(error)
    res.json(null)
  }
}

//@desc  apply coupon to user cart
//@route POST /api/user/cart/coupon
//@access private
export const applyCouponToUserCart = async (req, res) => {
  try {
    const { coupon } = req.body

    const user = await User.findOne({ email: req.user.email }).exec()
    const validCoupon = await Coupon.findOne({ name: coupon }).exec()

    if (validCoupon === null) {
      await Cart.findOneAndUpdate(
        { orderedBy: user._id },
        { totalAfterDiscount: 0, couponCode: null },
        {
          new: true,
        }
      )
      return res.json({ err: 'Invalid Coupon' })
    }

    const { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product', '_id title price')
      .exec()

    //calculate total after discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2)

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount, couponCode: coupon },
      {
        new: true,
      }
    )

    res.json({ totalAfterDiscount })
  } catch (err) {
    console.log(err)
  }
}
