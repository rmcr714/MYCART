import Product from '../models/productModel.js'
import slugify from 'slugify'

//@desc   Create a new Product
//@route  POST /api/product
//@access  Admin
export const create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}

//@desc  Fetch all the products
//@route  GET /api/products
//@access  public
export const read = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (err) {}
}
