import axios from 'axios'
//sending login token to backend
export const createOrUpdateUser = async (authToken) => {
  return await axios.post(
    `/api/create-or-update-user`,
    {},
    {
      headers: {
        authToken,
      },
    }
  )
}
