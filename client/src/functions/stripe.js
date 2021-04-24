import axios from 'axios'

export const createPaymentIntent = async (authToken) =>
  await axios.post(
    '/api/create-payment-intent',
    {},
    {
      headers: {
        authToken,
      },
    }
  )
