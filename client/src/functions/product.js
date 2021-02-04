import axios from 'axios'

//Create a product
export const createProduct = async (product, authToken) => {
  return await axios.post(`/api/product`, product, {
    headers: {
      authToken,
    },
  })
}

export const getProductsByCount = async (count) => {
  return await axios.get(`/api/products/${count}`)
}
