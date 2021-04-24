import axios from 'axios'

export const createPaymentIntent = async (authToken, coupon) =>
  await axios.post(
    '/api/create-payment-intent',
    { couponApplied: coupon },
    {
      headers: {
        authToken,
      },
    }
  )
