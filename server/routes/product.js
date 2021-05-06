import express from 'express'
import axios from 'axios'
const router = express.Router()

//middlewares
import { authCheck, adminCheck } from '../middlewares/auth.js'
import { listAllCache } from '../middlewares/productCache.js'

//controller
import {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} from '../controllers/productController.js'

//routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/total', productsCount) //Get the total number of products, useful for pagination
router.get('/products/:count', listAllCache, listAll) //return only count number of  products
router.delete('/product/:slug', authCheck, adminCheck, remove) //remove a product
router.get('/product/:slug', read) //read a product based on slug
router.put('/product/:slug', authCheck, adminCheck, update) //update the product

router.post('/products', list) //list the products in ascending descending etc order based on the data passed in parameter

//Rating
router.put('/product/star/:productId', authCheck, productStar)

//fetch related products based on category except the current product
router.get('/product/related/:productId', listRelated)

//search product functionality
router.post('/search/filters', searchFilters)

//making api call to check zip code
router.post('/zip', async (req, res) => {
  const { zip } = req.body

  await axios
    .get(`http://www.postalpincode.in/api/pincode/${zip}`, { timeout: 3000 })
    .then(({ data }) => res.json(data))
    .catch((error) => console.log(error.response))
})

export default router
