import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeCheckout from '../components/StripeCheckout'
import '../stripe.css'

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const Payment = () => {
  return (
    <div className='container mt-4 text-center'>
      <br />
      <br />
      <h4>Complete your purchase</h4>

      <Elements stripe={promise}>
        <div className='col-md-8 offset-2'>
          <StripeCheckout />
        </div>
      </Elements>
    </div>
  )
}

export default Payment
