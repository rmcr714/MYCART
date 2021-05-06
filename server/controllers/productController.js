import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import slugify from 'slugify'
import redis from 'redis'
import mongoose from 'mongoose'

//connection to redis
const redisClient = redis.createClient({
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 3) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

redisClient.on('error', (err) => {
  console.log('redis disconnected')
})

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

    console.log(redisClient.connected)
    if (products !== null && redisClient.connected) {
      redisClient.setex(req.params.count, 600, JSON.stringify(products))
    }
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

      // let average = 0
      // ratingAdded.ratings.forEach((value) => (average = average + value.star))
      // let floorAverage = Math.floor(average / ratingAdded.ratings.length)
      // console.log(floorAverage)
      // await Product.findByIdAndUpdate(product._id, {
      //   averageRating: floorAverage,
      // })

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
      // let average = 0
      // product.ratings.forEach((value) => (average = average + value.star))
      // console.log(average)
      // console.log(product.ratings.length)
      // let floorAverage = Math.floor(average / product.ratings.length)
      // console.log(floorAverage)
      // await Product.findByIdAndUpdate(product._id, {
      //   averageRating: floorAverage,
      // })

      res.json(ratingUpdated)
    }
  } catch (err) {
    console.log(err)
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

const handlePrice = async (req, res, price, category, brand) => {
  try {
    if (brand == undefined || brand == '') {
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
    } else {
      const products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
        category: category,
        brand: brand,
      })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()
      // console.log(products)
      res.json(products)
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err: err.message,
    })
  }
}

const handleStars = async (req, res, stars, price, category, brand) => {
  console.log(
    'stars===>',
    stars,
    'price=====>',
    price,
    'category====>',
    category,
    'brand=====>',
    brand
  )
  try {
    if (brand == '' || brand == undefined) {
      const products = await Product.aggregate([
        {
          $project: {
            brand: '$brand',
            category: '$category',
            title: '$title',
            color: '$color',
            description: '$description',
            createdAt: '$createdAt',
            price: '$price',
            images: '$images',
            quantity: '$quantity',
            slug: '$slug',
            shipping: '$shipping',
            ratings: '$ratings',
            updatedAt: '$updatedAt',
            floorAverage: {
              $floor: { $avg: '$ratings.star' },
            },
          },
        },
        {
          $match: {
            $and: [
              { floorAverage: stars },
              {
                price: {
                  $gte: price[0],
                  $lte: price[1],
                },
              },
              { category: new mongoose.Types.ObjectId(category) },
            ],
          },
        },
      ])
      // .exec((err,aggregates)=>{

      // })
      console.log(products)

      res.json(products)
    } else {
      const products = await Product.aggregate([
        {
          $project: {
            brand: '$brand',
            category: '$category',
            title: '$title',
            color: '$color',
            description: '$description',
            createdAt: '$createdAt',
            price: '$price',
            images: '$images',
            quantity: '$quantity',
            slug: '$slug',
            shipping: '$shipping',
            ratings: '$ratings',
            updatedAt: '$updatedAt',
            floorAverage: {
              $floor: { $avg: '$ratings.star' },
            },
          },
        },
        {
          $match: {
            $and: [
              { floorAverage: stars },
              {
                price: {
                  $gte: price[0],
                  $lte: price[1],
                },
              },
              { category: new mongoose.Types.ObjectId(category) },
              { brand: brand },
            ],
          },
        },
      ])
      // .exec((err,aggregates)=>{

      // })
      console.log(products, 'we  have a brand')

      res.json(products)
    }
  } catch (err) {
    console.log(err)
  }
}

//@desc  Search the products
//@route POST api/search/filters
//@access public
export const searchFilters = async (req, res) => {
  const { query, price, category, stars, brand } = req.body

  console.log(
    'the data got is ',
    typeof price,
    typeof category,
    typeof stars,
    brand
  )
  //filter on text
  if (query) {
    console.log(query)
    await handleQuery(req, res, query)
  }

  //filter on price eg price[20,100]
  if (price !== undefined && stars == '') {
    console.log('price is --->', price)
    await handlePrice(req, res, price, category, brand)
  }

  if (stars !== undefined) {
    await handleStars(req, res, stars, price, category, brand)
  }
}
