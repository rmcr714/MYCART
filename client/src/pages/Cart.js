import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Cart = () => {
  //redux
  const { user, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const getTotal = () => {
    return cart.reduce((current, next) => {
      return current + next.count * next.price
    }, 0)
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

              {cart.length == 0 ? (
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
                cart.map((data) => (
                  <div className='row mb-4 ml-2'>
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
                            <h5>{data.title}</h5>
                            <p className='mb-3 text-muted text-uppercase small'>
                              {data.brand}
                            </p>
                            <p className='mb-2 text-muted text-uppercase small'>
                              Color: {data.color}
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
                                defaultValue='1'
                              />
                            </div>
                            <small
                              id='passwordHelpBlock'
                              className='form-text text-muted text-center'
                            >
                              (Note, 1 piece)
                            </small>
                          </div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                          <div>
                            <a
                              href='#!'
                              type='button'
                              className='card-link-secondary small text-uppercase mr-3'
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
              <h5 className='mb-3'>The total amount of</h5>

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
                  className='btn btn-outline-primary btn-block'
                  disabled={cart.length == 0}
                >
                  go to checkout
                </button>
              ) : (
                <button
                  type='button'
                  className='btn btn-outline-primary btn-block'
                >
                  Login to continue
                </button>
              )}
            </div>
          </div>

          <div className='mb-3'>
            <div className='pt-4'>
              <a
                className='dark-grey-text d-flex justify-content-between'
                data-toggle='collapse'
                href='#collapseExample'
                aria-expanded='false'
                aria-controls='collapseExample'
              >
                Add a discount code (optional)
                <span>
                  <i className='fas fa-chevron-down pt-1'></i>
                </span>
              </a>

              <div className='collapse' id='collapseExample'>
                <div className='mt-3'>
                  <div className='md-form md-outline mb-0'>
                    <input
                      type='text'
                      id='discount-code'
                      className='form-control font-weight-light'
                      placeholder='Enter discount code'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
