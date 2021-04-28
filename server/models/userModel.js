import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, index: true },
    picture: { type: String, default: '' },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    addresses: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
        state: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        addressType: { type: String, default: 'home' },
      },
    ],
    wishlist: [{ type: ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
