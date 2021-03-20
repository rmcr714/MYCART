import Product from '../models/productModel.js'
import User from '../models/userModel.js'
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
//@route  POST /api/products
//@access  Public
export const list = async (req, res) => {
  try {
    //sort = createdAt/updatedAt , order =  asc/desc, page= 1,2 ..
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

//@desc  Add or update rating for a product
//@route PUT /api/product/star/:productId
//@access private
export const productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({ email: req.user.email }).exec()
    const { star, comment } = req.body

    //check if rating already exists for the customer or not
    let existingRatingObject = product.ratings.find(
      (element) => element.postedBy.toString() === user._id.toString() //=== doesnt work when comparing ids in mongoose without toString()
    )

    //if user has not given rating ,then
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: user._id,
              name: user.name,
            },
          },
        },
        { new: true }
      ).exec()

      res.json(ratingAdded)
    } else {
      //if user wants to update his rating and comment
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
        { new: true }
      ).exec()

      res.json(ratingUpdated)
    }
  } catch (err) {
    res.status(400).json({
      err: err.message,
    })
  }
}

//@desc  Get related products for the category except the current product (productId)
//@route GET /api/product/related/:productId
//@access public
export const listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate('category')
      .populate('subs')
      .exec()

    res.json(relatedProducts)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err: err.message,
    })
  }
}

//SEARCHING AND FILTERING FUNCTIONS
const handleQuery = async (req, res, query) => {
  const products = await Product.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

const handlePrice = async (req, res, price, category) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
      category: category,
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec()
    // console.log(products)
    res.json(products)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err: err.message,
    })
  }
}

//@desc  Search the products
//@route POST api/search/filters
//@access public
export const searchFilters = async (req, res) => {
  const { query, price, category } = req.body

  console.log('the data got is ',typeof  price,typeof category)
  //filter on text
  if (query) {
    console.log(query)
    await handleQuery(req, res, query)
  }

  //filter on price eg price[20,100]
  if (price !== undefined) {
    console.log('price is --->', price)
    await handlePrice(req, res, price, category)
  }
}
