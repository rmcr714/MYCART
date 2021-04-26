import Order from '../models/orderModel.js'

//@desc get all orders
//@route GET /api/admin/orders
//@access  Admin
export const orders = async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .sort('-createdAt')
      .populate('products.product')
      .exec()
    res.json(allOrders)
  } catch (err) {
    console.log(err)
  }
}

//@desc update order
//@route PUT /api/admin/order-status
//@access  Admin
export const orderStatus = async (req, res) => {
  try {
    console.log(req.body)
    let { orderId, orderStatus, shippingBy, trackingId } = req.body

    let updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, shippingBy, trackingId },
      { new: true }
    ).exec()

    res.json(updated)
  } catch (err) {
    console.log(err)
  }
}
