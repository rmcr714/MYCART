import axios from 'axios'

//Create a product
export const createProduct = async (product, authToken) => {
  return await axios.post(`/api/product`, product, {
    headers: {
      authToken,
    },
  })
}

//get products by count
export const getProductsByCount = async (count) => {
  return await axios.get(`/api/products/${count}`)
}

//delete a product
export const removeProduct = async (slug, authToken) => {
  return await axios.delete(`/api/product/${slug}`, {
    headers: {
      authToken,
    },
  })
}

export const getProduct = async (slug) => {
  return await axios.get(`/api/product/${slug}`)
}

export const updateProduct = async (slug, authToken, product) => {
  return await axios.put(`/api/product/${slug}`, product, {
    headers: {
      authToken,
    },
  })
}

//Getting sorted products
export const getProducts = async (sort, order, page) => {
  return await axios.post('/api/products', { sort, order, page })
}

export const getProductsCount = async () => {
  return await axios.get('/api/products/total')
}

export const productStar = async (productId, star, comment, authToken) => {
  return await axios.put(
    `/api/product/star/${productId}`,
    { star, comment },
    {
      headers: {
        authToken,
      },
    }
  )
}

//get related products (based on category)
export const getRelated = async (productId) => {
  return axios.get(`/api/product/related/${productId}`)
}

//SEARCH and FILTER

//get the products based on search text
export const fetchProductsByFilter = async (arg) => {
  console.log(arg)
  return await axios.post(`/api/search/filters`, arg)
}
