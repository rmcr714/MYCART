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
export const listAll = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(products)
  } catch (err) {
    console.log(err)
  }
}

//@desc  Delete a specific product
//@route  DELETE /api/product/:slug
//@access  Admin
export const remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec()
    res.json(deletedProduct)
  } catch (err) {
    res.status(400).send('Product delete failed')
  }
}

//@desc  Get a specific product
//@route  GET /api/product/:slug
//@access  public
export const read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec()

  res.json(product)
}

//@desc  update a specific product
//@route  PUT /api/product/:slug
//@access  Admin
export const update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
      }
    ).exec()

    res.json(updated)
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}

//@desc  update a specific product
//@route  PUT /api/product/:slug
//@access  Admin
export const list = async (req, res) => {
  try {
    //sort = createdAt/updatedAt , order =  asc/desc, limt = 3,4...
    const { sort, order, limit } = req.body
    const products = await Product.find({})
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(limit)
      .exec()
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}
