import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeCheckout from '../components/StripeCheckout'
import '../stripe.css'

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const Payment = ({ history }) => {
  useEffect(() => {
    var item = JSON.stringify(localStorage.getItem('cart'))

    if (item == null || item.length == 4) {
      history.push('/cart')
    }
  }, [])

  return (
    <div className='container mt-4 text-center'>
      <br />
      <br />
      <h5>Complete your purchase</h5>

      <Elements stripe={promise}>
        <div className='col-md-8 offset-2'>
          <StripeCheckout />
        </div>
      </Elements>
    </div>
  )
}

export default Payment
