import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minlength: [6, 'Too short, should be 6 or more characters'],
      maxlength: [13, 'too long'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
