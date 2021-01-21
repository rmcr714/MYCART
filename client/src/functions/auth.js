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

//getting the currently logged in user using the auth token
export const currentUser = async (authToken) => {
  return await axios.post(
    `/api/current-user`,
    {},
    {
      headers: {
        authToken,
      },
    }
  )
}
