import axios from 'axios'

export const getCoupons = async () => await axios.get('/api/coupons')

export const removeCoupon = async (couponId, authToken) =>
  await axios.delete(`/api/coupon/${couponId}`, {
    headers: {
      authToken,
    },
  })

export const createCoupon = async (coupon, authToken) =>
  await axios.post(
    `/api/coupon`,
    { coupon },
    {
      headers: {
        authToken,
      },
    }
  )
