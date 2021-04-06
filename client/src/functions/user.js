import axios from 'axios'

export const userCart = async (cart, authToken) =>
  await axios.post(
    `/api/user/cart`,
    { cart },
    {
      headers: {
        authToken,
      },
    }
  )

export const getUserCart = async (authToken) =>
  await axios.get(`/api/user/cart`, {
    headers: {
      authToken,
    },
  })

export const saveAddress = async (authToken, addresses) =>
  await axios.post(
    `/api/user/address`,
    { addresses },
    {
      headers: {
        authToken,
      },
    }
  )

export const deleteAddress = async (authToken, data) =>
  await axios.post(
    `/api/user/deleteaddress`,
    { data },
    {
      headers: {
        authToken,
      },
    }
  )
