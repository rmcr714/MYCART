import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Coupon from '../models/couponModel.js'
import Order from '../models/orderModel.js'
import oAuth2Client from '../oAuth2/oAuthInit.js'
import nodemailer from 'nodemailer'

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

//@desc  create order
//@route POST /api/user/order
//@access private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, totalPrice, couponApplied } =
      req.body.order
    const paymentIntent = req.body.order.stripeResponse.paymentIntent
    const user = await User.findOne({ email: req.user.email }).exec()
    let { products, couponCode } = await Cart.findOne({
      orderedBy: user._id,
    }).exec()
    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product')
      .populate('orderedBy')
      .exec()

    let newOrder = await Order({
      products: products,
      paymentIntent,
      orderedBy: user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      couponApplied,
      couponCode,
    }).save()

    //increment count,
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }
    })

    let updated = await Product.bulkWrite(bulkOption, {})
    const sendmail = async () => {
      console.log('running sendmail')
      try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'tiwari136@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
          },
        })
        const mailOptions = {
          from: 'tiwari136@gmail.com',
          to: req.user.email,
          subject: 'Your Order has been placed',
          text: 'Gmail api test1',
          html: `<!DOCTYPE html>
            <html>
            <head>
            <title>Page Title</title>
            <style>
            
            .header {
            background-color: #87CEFA;
            color:white,
            }
            </style>
            </head>
            <body>
            <table>
            <tr style = 'background-color: #87CEFA;color:white'>
            <td colspan="7"><h2>MY CART</h2> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;       </td>
            <td><h3>Order Placed</h3></td></tr>
            
            <tr>
            
            <td> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   </td>
            <td>    </td>
            
            <td>hi <b> ${
              cart.orderedBy.name ? cart.orderedBy.name : cart.orderedBy.email
            }</b>&nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;                </td>
            <td><small>order placed on </small><b>${newOrder.createdAt}</b></td>
            
            
            </tr>
            <tr>
            
            <td> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   </td>
            <td>    </td>
            
            <td><small>Your order has been successfully placed</small>&nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;      </td>
            <td><small>order Id: </small><b>${`OD` + newOrder._id}</b></td>
            </tr>
            
            
            <tr>
            <td>    </td>
            <td>    </td>
            <td>
            
            <h2>Delivery Address</h2>
            <p>${newOrder.shippingAddress.firstName}<br> ${
            newOrder.shippingAddress.address
          }<br>${newOrder.shippingAddress.city}<br>${
            newOrder.shippingAddress.zip
          }</p>
            <button style='background-color: #FF7F50;border-radius:20px'><a href = 'https://mycart-ecommerce-app.herokuapp.com/user/history' style = 'color:white;'><h4>Manage your Orders</h4> </a></button>
            </td>
      <td><div style="text-align:center">
  <h1>Order Status</h1>
  <span style ="height: 25px;
  width: 25px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;"></span><small>Placed</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style ="height: 25px;
  width: 25px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;"></span><small>Packed</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style ="height: 25px;
  width: 25px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;"></span><small>shipped</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style ="height: 25px;
  width: 25px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;"></span><small>Delivered</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div></td>
      </tr>
      <tr>
      <td></td>
      </tr>
            </table>
            <hr/>
            <h3>Your Orders</h3>
            <table>
            ${cart.products.map(
              (product) =>
                `<tr>
                  <td>
                    <img
                      src=${product.product.images[0].url}
                      alt='Trulli'
                      width='150'
                      height='80'
                    />
                  </td>
                  <td>
                  ${product.product.title}
                    <br />
                    Delivery: In the next 7 days(tentative)
                    <br />
                    Seller: Anurag electronics
                    <br />
                    Qty:${product.count}
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td>
                    <b> $${product.product.price}</b>
                    <br />
                    <br />
                    <br />
                    <br />
                  </td>
                </tr>
                `
            )}
            <tr>
                  <td>
                    <hr />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <h3>Total Price to be paid: $${
                        newOrder.totalPrice
                      } only</h3>
                    </b>
                  </td>
                </tr>
            
            
            </table>
            <br/>
            <br/>
            <h2>Thanks for shopping with us!!</h2>
            <small>For any queries contact our customer support 24x7<small>
            
            
            
            
            </body>
            </html>
            
            `,
        }
        const result = await transport.sendMail(mailOptions)
        return result
      } catch (err) {
        return err
      }
    }

    sendmail()
      .then((result) => console.log('email is sent successfully', result))
      .catch((err) => console.log(err.message))

    res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}

//@desc  delete user cart
//@route DELETE /api/user/cart
//@access private
export const emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec()
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()

    res.json(cart)
  } catch (err) {
    console.log(err)
  }
}

//@desc  get user orders
//@route GET /api/user/order
//@access private
export const orders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
    const userOrders = await Order.find({ orderedBy: user._id })
      .populate('products.product')
      .exec()
    res.json({ userOrders })
  } catch (err) {
    console.log(err)
  }
}

//@desc  get a particular order for tracking
//@route GET /api/user/tracking/:orderId
//@access private
export const orderTracking = async (req, res) => {
  try {
    console.log(req.params.orderId)

    const user = await User.findOne({ email: req.user.email })
    const userOrders = await Order.find({ orderedBy: user._id })

    const exists = userOrders.some((data) => data._id == req.params.orderId)

    if (exists) {
      const requiredOrder = await Order.findById({ _id: req.params.orderId })
        .populate('products.product')
        .exec()

      res.json({ requiredOrder })
    } else {
      res.json({ message: 'Unavailable' })
    }
  } catch (err) {
    console.log(err)
  }
}

//@desc  add products to wishlist
//@route POST /api/user/wishlist
//@access private
export const addToWishList = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $addToSet: { wishlist: productId },
      },
      { new: true }
    ).exec()

    res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}

//@desc  Get products in users wishlist
//@route GET /api/user/wishlist
//@access private
export const wishList = async (req, res) => {
  try {
    const wishlist = await User.findOne({ email: req.user.email })
      .select('wishlist')
      .populate('wishlist')
      .exec()

    res.json(wishlist)
  } catch (err) {
    console.log(err)
  }
}

//@desc  remove items from  wishlist
//@route PUT /api/user/wishlist
//@access private
export const removeFromWishList = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } }
    ).exec()

    res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}

//@desc  create cod orders
//@route GET /api/user/cod-order
//@access private
export const cashOnDelivery = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponApplied } = req.body.order
    console.log(shippingAddress, paymentMethod, couponApplied)

    const user = await User.findOne({ email: req.user.email }).exec()
    let { products, couponCode, totalAfterDiscount, cartTotal } =
      await Cart.findOne({
        orderedBy: user._id,
      }).exec()

    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product')
      .populate('orderedBy')
      .exec()

    let newOrder = await Order({
      products: products,

      orderedBy: user._id,
      shippingAddress,
      paymentMethod,
      totalPrice:
        totalAfterDiscount > 0 && couponApplied
          ? totalAfterDiscount
          : cartTotal,
      couponApplied,
      couponCode,
    }).save()

    //increment count,
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }
    })

    let updated = await Product.bulkWrite(bulkOption, {})

    const sendmail = async () => {
      console.log('running sendmail')
      try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'tiwari136@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
          },
        })
        const mailOptions = {
          from: 'tiwari136@gmail.com',
          to: req.user.email,
          subject: 'Your Order has been successfully placed',
          text: 'Gmail api test1',
          html: `<!DOCTYPE html>
            <html>
            <head>
            <title>Page Title</title>
            <style>
            
            .header {
            background-color: #87CEFA;
            color:white,
            }
            </style>
            </head>
            <body>
            <table>
            <tr style = 'background-color: #87CEFA;color:white'>
            <td colspan="7"><h2>MY CART</h2> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;       </td>
            <td><h3>Order Placed</h3></td></tr>
            
            <tr>
            
            <td> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   </td>
            <td>    </td>
            
            <td>hi <b> ${
              cart.orderedBy.name ? cart.orderedBy.name : cart.orderedBy.email
            }</b>&nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;                </td>
            <td><small>order placed on:  </small><b>${
              newOrder.createdAt
            }</b></td>
            </tr>
            <tr>
            <td> &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   </td>
            <td>    </td>
            <td><small>Your order has been successfully placed</small>&nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;   &nbsp;&nbsp;   &nbsp;&nbsp;      </td>
            <td><small>order Id: </small><b>${`OD` + newOrder._id}</b></td>
            </tr>
            <tr>
            <td>    </td>
            <td>    </td>
            <td>
            <h2>Delivery Address</h2>
            <p>${newOrder.shippingAddress.firstName}<br> ${
            newOrder.shippingAddress.address
          }<br>${newOrder.shippingAddress.city}<br>${
            newOrder.shippingAddress.zip
          }</p>
          <button style='background-color: #FF7F50;border-radius:20px'><a href = 'https://mycart-ecommerce-app.herokuapp.com/user/history' style = 'color:white;'><h4>Manage your Orders</h4> </a></button>
          </td>
    <td><div style="text-align:center">
<h1>Order Status</h1>
<span style ="height: 25px;
width: 25px;
background-color: green;
border-radius: 50%;
display: inline-block;"></span><small>Placed</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<span style ="height: 25px;
width: 25px;
background-color: gray;
border-radius: 50%;
display: inline-block;"></span><small>Packed</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<span style ="height: 25px;
width: 25px;
background-color: gray;
border-radius: 50%;
display: inline-block;"></span><small>shipped</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<span style ="height: 25px;
width: 25px;
background-color: gray;
border-radius: 50%;
display: inline-block;"></span><small>Delivered</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div></td>
    </tr>
    <tr>
    <td></td>
    </tr>
          </table>
          <hr/>
          <h3>Your Orders</h3>
            <table>
            ${cart.products.map(
              (product) =>
                `<tr>
                  <td>
                    <img
                      src=${product.product.images[0].url}
                      alt='Trulli'
                      width='150'
                      height='80'
                    />
                  </td>
                  <td>
                  ${product.product.title}
                    <br />
                    Delivery: In the next 7 days(tentative)
                    <br />
                    Seller: Anurag electronics
                    <br />
                    Qty:${product.count}
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                  <td>
                  <b> $${product.product.price}</b>
                    <br />
                    <br />
                    <br />
                    <br />
                  </td>
                </tr>
                `
            )}
            <tr>
                  <td>
                    <hr />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <h3>Total Price to be paid: $${
                        newOrder.totalPrice
                      } only</h3>
                    </b>
                  </td>
                </tr>
            </table>
            <br/>
            <br/>
            <h2>Thanks for shopping with us!!</h2>
            <small>For any queries contact our customer support 24x7<small>
            </body>
            </html>
            
            `,
        }
        const result = await transport.sendMail(mailOptions)

        return result
      } catch (err) {
        return err
      }
    }

    sendmail()
      .then((result) => console.log('email is sent successfully', result))
      .catch((err) => console.log(err.message))

    res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}
