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
export const getProducts = async (sort, order, limit) => {
  return await axios.post('/api/products', { sort, order, limit })
}
