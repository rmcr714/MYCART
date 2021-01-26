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
    address: String,
    //   wishlistL:[{type:ObjectId,ref:'Product'}],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
