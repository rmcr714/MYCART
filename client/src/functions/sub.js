import axios from 'axios'

//Getting list of sub categories from backend
export const getSubs = async () => {
  return await axios.get(`/api/subs`)
}

//Getting a particular sub category
export const getSub = async (slug) => {
  return await axios.get(`/api/sub/${slug}`)
}

//Deleting a sub category
export const removeSub = async (slug, authToken) => {
  return await axios.delete(`/api/sub/${slug}`, {
    headers: {
      authToken,
    },
  })
}

//Updating a sub category
export const updateSub = async (authToken, name, slug) => {
  return await axios.put(
    `/api/sub/${slug}`,
    { name, slug },
    {
      headers: {
        authToken,
      },
    }
  )
}

//Create a sub category
export const createSub = async ({ name, parent }, authToken) => {
  return await axios.post(
    `/api/sub`,
    { name, parent },
    {
      headers: {
        authToken,
      },
    }
  )
}
