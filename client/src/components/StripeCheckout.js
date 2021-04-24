import React from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { createPaymentIntent } from '../functions/stripe'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createOrder, emptyUserCart } from '../functions/user'

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch()
  const { user, coupon, userAddress } = useSelector((state) => ({ ...state }))

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')

  const [cartTotal, setCartTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [payable, SetPayable] = useState(0)

  //stripe specific
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      setClientSecret(res.data.clientSecret)
      console.log(res)
      //payment response
      setCartTotal(res.data.cartTotal)
      setTotalAfterDiscount(res.data.totalAfterDiscount)
      SetPayable(res.data.payable)
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

      createOrder(
        {
          stripeResponse: payload,
          shippingAddress: userAddress,
          paymentMethod: 'card',
          totalPrice:
            totalAfterDiscount > 0 && coupon ? totalAfterDiscount : cartTotal,
          couponApplied: coupon,
        },
        user.token
      ).then((res) => {
        if (res.data.ok) {
          //empty cart from localstorage
          if (typeof window !== 'undefined') localStorage.removeItem('cart')
          //empty cart from redux
          dispatch({
            type: 'ADD_TO_CART',
            payload: [],
          })
          //reset coupon to false
          dispatch({ type: 'COUPON_APPLIED', payload: false })

          //empty cart from backend
          emptyUserCart(user.token)
        }
        console.log(res)
      })
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

      <form id='payment-form' onSubmit={handleSubmit}>
        {/* use className='stripe-form' in form above, removed it intentionally*/}
        <div className='card  bg-light '>
          <div
            className='card-header h4 bg-secondary text-white '
            style={{ textAlign: 'left' }}
          >
            Payment
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-4'>
                <h5 style={{ textAlign: 'left' }}>Total Amount</h5>
              </div>
              <div className='col-md-4 offset-2'>
                <span className='text-dark h5'>${cartTotal}</span>
                {}
              </div>
              <br />
              <br />

              <div className='col-md-4'>
                <h5 style={{ textAlign: 'left' }}>Discounted price</h5>
              </div>
              <div className='col-md-4 offset-2'>
                <span className='text-dark h5'>
                  {' '}
                  $
                  {totalAfterDiscount > 0 && coupon
                    ? cartTotal - totalAfterDiscount
                    : 0}
                </span>
                {}
              </div>

              <br />
              <br />
              <div className='col-md-4'>
                <h5 style={{ textAlign: 'left' }}>Total Payable</h5>
              </div>

              <div className='col-md-4 offset-2'>
                <span className='text-danger h4'>
                  $
                  {totalAfterDiscount > 0 && coupon
                    ? totalAfterDiscount
                    : cartTotal}
                </span>
                {}
              </div>
              <br />
              {totalAfterDiscount > 0 && coupon ? (
                <p className='text-success mb-0'>
                  <i class='fas fa-tags mr-1 ml-2'></i> Discount applied!
                  <sup>*</sup>
                </p>
              ) : (
                <p className='text-info'>
                  <i class='fas fa-file-alt mr-1 ml-2'></i>&nbsp; gst number can
                  be obtained after payment
                </p>
              )}
            </div>
            <br />
            <br />
            <br />
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
                {processing ? (
                  <div className='spinner' id='spinner'></div>
                ) : (
                  'Pay'
                )}
              </span>
            </button>
            <br />
            {error && (
              <div className='card-error text-danger' role='alert'>
                {error}
              </div>
            )}
            <br />
            <br />
            <div className='mb-3 ml-3' style={{ textAlign: 'left' }}>
              <div className='pt-4'>
                <img
                  className='mr-2'
                  width='45px'
                  src='https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg'
                  alt='Visa'
                />
                <img
                  className='mr-2'
                  width='45px'
                  src='https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg'
                  alt='American Express'
                />
                <img
                  className='mr-2'
                  width='45px'
                  src='https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg'
                  alt='Mastercard'
                />
                <img
                  className='mr-2'
                  width='45px'
                  src='https://mdbootstrap.com/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png'
                  alt='PayPal acceptance mark'
                />
              </div>
            </div>
            <p className='text-primary mb-0' style={{ textAlign: 'left' }}>
              <i className=' fas fa-info-circle mr-1 ml-2'></i> for any issues
              related to payment contact the respective bank or our helpline
            </p>
          </div>
        </div>
      </form>
    </>
  )
}

export default StripeCheckout
