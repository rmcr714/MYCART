import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
      text: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subs: [
      {
        type: ObjectId,
        ref: 'Sub',
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: { type: Array },
    shipping: {
      type: String,
      enum: ['Yes', 'No'],
    },
    color: {
      type: String,
      enum: ['Black', 'brown', 'silver', 'white', 'blue'],
    },
    brand: {
      type: String,
      enum: [
        'Samsung',
        'Microsoft',
        'Apple',
        'Lenovo',
        'ASUS',
        'DELL',
        'HP',
        'REALME',
      ],
    },
    ratings: [
      {
        type: new mongoose.Schema(
          {
            star: Number,
            name: String,
            postedBy: { type: ObjectId, ref: 'User' },
            comment: String,
          },
          { timestamps: true }
        ),
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)
export default Product
