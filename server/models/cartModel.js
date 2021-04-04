import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const cartSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: { type: ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
