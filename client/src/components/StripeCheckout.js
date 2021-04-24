import React from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { createPaymentIntent } from '../functions/stripe'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => ({ ...state }))

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')

  //stripe specific
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    createPaymentIntent(user.token).then((res) => {
      setClientSecret(res.data.clientSecret)
      console.log(res)
    })
  }, [])

  //style for cartElement
  const cartStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    })

    if (payload.error) {
      setError(`payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      //success
      //will create an order and save it to db and then empty user cart
      console.log(JSON.stringify(payload))
      setError(null)
      setProcessing(false)
      setSuccess(true)
    }
  }

  const handleChange = (e) => {
    //listen to changes in the card details entered and show the errors if customer types something wrong
    setDisabled(e.empty)
    setError(e.error ? e.error.message : '')
  }

  return (
    <>
      <p className={success ? 'result-message text-success' : ' hidden'}>
        Payment Successful{' '}
        <Link to='/user/history'>&nbsp;Go to Purchase history</Link>
      </p>
      <form id='payment-form' className='stripe-form' onSubmit={handleSubmit}>
        <CardElement
          id='card-element'
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className='stripe-button'
          disabled={processing || disabled || success}
        >
          <span id='button-text'>
            {processing ? <div className='spinner' id='spinner'></div> : 'Pay'}
          </span>
        </button>
        <br />
        {error && (
          <div className='card-error text-danger' role='alert'>
            {error}
          </div>
        )}
      </form>
    </>
  )
}

export default StripeCheckout
