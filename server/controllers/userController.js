import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'

//@desc  save cart data in cart collection
//@route POST /api/cart
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
//@route GET /api/cart
//@access private
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec()

    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product', '_id title price totalAfterDiscount')
      .exec()

    const { products, cartTotal, totalAfterDiscount } = cart

    res.json({ products, cartTotal, totalAfterDiscount })
  } catch (error) {
    console.log(error)
    res.json(null)
  }
}
