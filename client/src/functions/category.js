import axios from 'axios'

//Getting list of categories from backend
export const getCategories = async () => {
  return await axios.get(`/api/categories`)
}

//Getting a particular category
export const getCategory = async (slug) => {
  return await axios.get(`/api/category/${slug}`)
}

//Deleting a category
export const removeCategory = async (slug, authToken) => {
  return await axios.delete(`/api/category/${slug}`, {
    headers: {
      authToken,
    },
  })
}

//Updating a category
export const updateCategory = async (authToken, name, slug) => {
  return await axios.put(
    `/api/category/${slug}`,
    { name, slug },
    {
      headers: {
        authToken,
      },
    }
  )
}

//Create a category
export const createCategory = async (name, authToken) => {
  return await axios.post(
    `/api/category`,
    { name },
    {
      headers: {
        authToken,
      },
    }
  )
}

//Getting subcategories for a particular category
export const getCategorySubs = async (_id) => {
  return await axios.get(`/api/category/subs/${_id}`)
}
