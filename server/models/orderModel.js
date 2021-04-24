import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema

const orderSchema = mongoose.Schema(
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
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'Processing',
        'Dispatched',
        'Cancelled',
        'Completed',
      ],
    },
    orderedBy: { type: ObjectId, ref: 'User' },
    shippingAddress: {},
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true, default: 0 },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    couponApplied: {
      type: Boolean,
      required: true,
      default: false,
    },
    couponCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
