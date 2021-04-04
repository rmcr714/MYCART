import { toast } from 'react-toastify'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { userCart } from '../functions/user'

const Cart = ({ history }) => {
  const colors = ['Black', 'brown', 'silver', 'white', 'blue']

  //redux
  const { user, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const getTotal = () => {
    return cart.reduce((current, next) => {
      return current + next.count * next.price
    }, 0)
  }

  //save to db on checkout
  const saveOrderToDb = () => {
    console.log('saving to db')
    userCart(cart, user.token)
      .then((res) => {
        console.log(res)
        if (res.data.ok) {
          history.push('/checkout')
        }
      })
      .catch((error) => {
        console.log('cart save error', error)
      })
  }

  //change color or select a new color
  const handleColorChange = (e, productId) => {
    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.map((product, i) => {
        if (product._id === productId) {
          cart[i].color = e.target.value
        }
      })

      localStorage.setItem('cart', JSON.stringify(cart))

      dispatch({ type: 'ADD_TO_CART', payload: cart })
    }
  }

  //Change Quantity
  const handleQuantityChange = (e, productId, quantity) => {
    console.log(quantity)
    if (e.target.value > 4) {
      e.target.value = 4
    }
    if (e.target.value === '' || e.target.value === '0') {
      e.target.value = 1
    }
    if (quantity < e.target.value) {
      toast.error(`Max Quantity Available ${quantity}`)
      return
    }

    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.map((product, i) => {
        if (product._id === productId) {
          cart[i].count = e.target.value
        }
      })

      localStorage.setItem('cart', JSON.stringify(cart))

      dispatch({ type: 'ADD_TO_CART', payload: cart })
    }
  }

  //Remove Item
  const handleRemove = (productId) => {
    console.log(productId)

    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.map((product, i) => {
        if (product._id === productId) {
          cart.splice(i, 1)
        }
      })

      localStorage.setItem('cart', JSON.stringify(cart))

      dispatch({ type: 'ADD_TO_CART', payload: cart })
    }
  }

  return (
    <section className='mt-5'>
      <div className='row'>
        <div className='col-lg-8'>
          <div className='mb-3'>
            <div className='pt-4 wish-list'>
              <h5 className='mb-4 ml-4 '>
                Cart (<span>{cart.length}</span> items)
              </h5>

              {cart.length === 0 ? (
                <>
                  <h4 className='ml-2 text-center mb-4'>
                    No products in the cart,&nbsp;
                    <Link to='/shop'>continue shopping</Link>
                  </h4>
                  <h4 className='text-center'>
                    {' '}
                    <i className='fas fa-cart-arrow-down fa-5x'></i>
                  </h4>
                  <br />
                </>
              ) : (
                cart.map((data, index) => (
                  <div className='row mb-4 ml-2' key={index}>
                    <div className='col-md-5 col-lg-3 col-xl-3'>
                      <div className='view zoom overlay z-depth-1 rounded mb-3 mb-md-0'>
                        <img
                          className='img-fluid w-90'
                          src={data.images[0].url}
                          alt='Sample'
                        />
                      </div>
                    </div>
                    <div className='col-md-7 col-lg-8 col-xl-8'>
                      <div>
                        <div className='d-flex justify-content-between'>
                          <div>
                            <Link to={`/product/${data.slug}`}>
                              {' '}
                              <h5>{data.title}</h5>
                            </Link>
                            <p className='mb-3 text-muted text-uppercase small'>
                              {data.brand}
                            </p>
                            <p className='mb-2 text-muted text-uppercase small'>
                              Color:{' '}
                              <span>
                                <select
                                  name='color'
                                  id=''
                                  onChange={(e) =>
                                    handleColorChange(e, data._id)
                                  }
                                  className='form-control col-md-2 col-xs-2'
                                >
                                  {data.color ? (
                                    <option value={data.color}>
                                      {data.color}
                                    </option>
                                  ) : (
                                    <option>Select a color</option>
                                  )}
                                  {colors
                                    .filter((c) => c !== data.color)
                                    .map((c) => (
                                      <option value={c} key={c}>
                                        {c}
                                      </option>
                                    ))}
                                </select>
                              </span>
                            </p>
                            <br />
                            <br />
                          </div>
                          <div>
                            <div className='def-number-input number-input safari_only mb-0 w-100'>
                              <input
                                className='form-control'
                                min='1'
                                max='4'
                                name='quantity'
                                type='number'
                                defaultValue={data.count}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    e,
                                    data._id,
                                    data.quantity
                                  )
                                }
                              />
                            </div>
                            <small
                              id='passwordHelpBlock'
                              className='form-text text-muted text-center'
                            >
                              (Note, {data.count} piece)
                            </small>
                          </div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                          <div>
                            <a
                              type='button'
                              className='card-link-secondary small text-uppercase mr-3 text-danger'
                              onClick={(e) => handleRemove(data._id)}
                            >
                              <i className='fas fa-trash-alt mr-1'></i> Remove
                              item{' '}
                            </a>
                            <a
                              href='#!'
                              type='button'
                              className='card-link-secondary small text-uppercase'
                            >
                              <i className='fas fa-heart mr-1'></i> Move to wish
                              list{' '}
                            </a>
                          </div>
                          <p className='mb-0'>
                            <span>
                              <strong id='summary'>${data.price}</strong>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <hr className='mb-4' />

              <p className='text-primary mb-0'>
                <i className='fas fa-info-circle mr-1 ml-2'></i> Do not delay
                the purchase, adding items to your cart does not mean booking
                them.
              </p>
            </div>
          </div>

          <div className='mb-3 ml-2'>
            <div className='pt-4'>
              <h5 className='mb-4'>Expected shipping delivery</h5>

              <p className='mb-0'> Depends on the availabity</p>
            </div>
          </div>

          <div className='mb-3 ml-3'>
            <div className='pt-4'>
              <h5 className='mb-4'>We accept</h5>
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
        </div>

        <div className='col-lg-4 mt-2'>
          <div className='mb-3'>
            <div className='pt-4'>
              <h5 className='mb-3 alert alert-dark'>Price Details</h5>
              <hr />

              <ul className='list-group list-group-flush'>
                {cart.length > 0 ? (
                  cart.map((c, i) => (
                    <div key={i}>
                      <li className='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0'>
                        {c.title} x {c.count}
                        <span>${c.price * c.count}</span>
                      </li>
                    </div>
                  ))
                ) : (
                  <li>No items in cart</li>
                )}
                <li className='list-group-item d-flex justify-content-between align-items-center px-0'>
                  Shipping
                  {cart.length > 0 ? (
                    getTotal() > 90 ? (
                      <span>free</span>
                    ) : (
                      <span>$10</span>
                    )
                  ) : (
                    <span>no items </span>
                  )}
                </li>
                <li className='list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3'>
                  <div>
                    <strong>The total amount of</strong>
                    <strong>
                      <p className='mb-0'>(including VAT)</p>
                    </strong>
                  </div>
                  <span>
                    {cart.length > 0 ? (
                      <strong>${getTotal()}</strong>
                    ) : (
                      <strong>0</strong>
                    )}
                  </span>
                </li>
              </ul>
              {user ? (
                <button
                  type='button'
                  className='text-center btn btn-primary btn-raised btn-block'
                  disabled={!cart.length}
                  onClick={saveOrderToDb}
                >
                  go to checkout
                </button>
              ) : (
                <button
                  type='button'
                  className='btn btn-outline-primary btn-block'
                >
                  <Link to={{ pathname: '/login', state: { from: 'cart' } }}>
                    {' '}
                    Login to continue
                  </Link>
                </button>
              )}
            </div>
          </div>

          <div className='mb-2 ml-1'>
            <div className='pt-4'>
              <p className='text-info mb-0'>
                <i class='fas fa-receipt'></i>&nbsp;&nbsp;coupons can be applied
                on the next page
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
