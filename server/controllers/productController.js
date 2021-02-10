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

//@desc  Fetch products based on count
//@route  GET /api/products/:count
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

//Without pagination
// //@desc  Get products based on sort order and other parameters
// //@route  POST /api/product/:slug
// //@access  Public
// export const list = async (req, res) => {
//   try {
//     //sort = createdAt/updatedAt , order =  asc/desc, limt = 3,4...
//     const { sort, order, limit } = req.body
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec()
//     res.json(products)
//   } catch (err) {
//     res.status(400).json({
//       err: err.message,
//     })
//   }
// }

//with pagination Step 2
//@desc  Get products based on sort order and other parameters
//@route  POST /api/product/:slug
//@access  Public
export const list = async (req, res) => {
  try {
    //sort = createdAt/updatedAt , order =  asc/desc, limt = 3,4...
    const { sort, order, page } = req.body
    const currentPage = page || 1
    const perPage = 3
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()
    res.json(products)
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}

//@desc  Get count of documents in Product collection i.e get  count all products (Pagination step 1)
//@route  GET /api/products/total
//@access  public
export const productsCount = async (req, res) => {
  try {
    const totalProducts = await Product.find({}).estimatedDocumentCount().exec()
    res.json(totalProducts)
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}
