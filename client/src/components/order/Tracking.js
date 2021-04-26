import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import '../css/order/tracking.css'
import { getTrackingDetails } from '../../functions/user'

const Tracking = ({ match }) => {
  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(false)

  //redux state
  const { user } = useSelector((state) => ({ ...state }))
  const orderId = match.params.orderId

  useEffect(() => {
    setLoading(true)
    getTrackingDetails(user.token, orderId).then((res) => {
      if (res.data.message) {
        setOrder(null)
        setLoading(false)
        console.log('inside error')
      } else {
        console.log('inside success')
        console.log(res.data.requiredOrder)
        setOrder(res.data.requiredOrder)
        setLoading(false)
      }
    })
  }, [])

  const showOrders = () =>
    order &&
    order.products &&
    order.products.map((product) => (
      <li className='col-md-4'>
        <figure className='itemside mb-3'>
          <div className='aside'>
            <img
              src={product.product.images[0].url}
              className='img-sm border'
            />
          </div>
          <figcaption className='info align-self-center'>
            <p className='title'>
              {product.product.title} <br />
            </p>{' '}
            <span className='text-muted'>${product.price} </span>
          </figcaption>
        </figure>
      </li>
    ))

  return (
    <>
      <br />
      <br />

      <div className='container' className='mt-4'>
        {loading ? (
          <div className='text-center mt-4 '>
            {' '}
            <LoadingOutlined className='h1 text-primary' />
          </div>
        ) : (
          <article className='card'>
            <header className='card-header'> My Orders / Tracking</header>
            {order !== null ? (
              <div className='card-body'>
                <h6>Order ID: OD{order._id}</h6>
                <article className='card'>
                  <div className='card-body row'>
                    <div className='col'>
                      {' '}
                      <strong>Estimated Delivery time:</strong> <br />
                      {order.orderStatus === 'Completed'
                        ? 'Delivered'
                        : ' A week from now'}
                    </div>
                    <div className='col'>
                      {' '}
                      <strong>Shipping BY:</strong> <br /> {order.shippingBy}, |{' '}
                      <i className='fa fa-phone'></i> +1598675986{' '}
                    </div>
                    <div className='col'>
                      {' '}
                      <strong>Status:</strong>
                      <br />
                      {order.orderStatus}{' '}
                    </div>
                    <div className='col'>
                      {' '}
                      <strong>Tracking #:</strong> <br /> {order.trackingId}{' '}
                    </div>
                  </div>
                </article>
                <div className='track'>
                  <div
                    className={
                      order.orderStatus === 'Not Processed' ||
                      order.orderStatus === 'Dispatched' ||
                      order.orderStatus === 'Completed' ||
                      order.orderStatus === 'Processing'
                        ? 'step active'
                        : 'step'
                    }
                  >
                    {' '}
                    <span className='icon'>
                      {' '}
                      <i className='fa fa-check'></i>{' '}
                    </span>{' '}
                    {order.orderStatus === 'Cancelled' ? (
                      <span className='text text-danger'>Cancelled</span>
                    ) : (
                      <span className='text'>Order confirmed</span>
                    )}
                  </div>
                  <div
                    className={
                      order.orderStatus === 'Dispatched' ||
                      order.orderStatus === 'Completed'
                        ? 'step active'
                        : 'step'
                    }
                  >
                    {' '}
                    <span className='icon'>
                      {' '}
                      <i className='fa fa-user'></i>{' '}
                    </span>{' '}
                    <span className='text'> Picked by courier</span>{' '}
                  </div>
                  <div
                    className={
                      order.orderStatus === 'Dispatched' ||
                      order.orderStatus === 'Completed'
                        ? 'step active'
                        : 'step'
                    }
                  >
                    {' '}
                    <span className='icon'>
                      {' '}
                      <i className='fa fa-truck'></i>{' '}
                    </span>{' '}
                    <span className='text'> On the way </span>{' '}
                  </div>
                  <div
                    className={
                      order.orderStatus === 'Completed' ? 'step active' : 'step'
                    }
                  >
                    {' '}
                    <span className='icon'>
                      {' '}
                      <i className='fa fa-box'></i>{' '}
                    </span>{' '}
                    <br />
                    <span className='text'>Ready for pickup</span>{' '}
                  </div>
                </div>
                <hr />
                <ul className='row'>{showOrders()}</ul>
                <hr />
                <a href='#' className='btn btn-warning' data-abc='true'>
                  {' '}
                  <Link to='/user/history'>
                    {' '}
                    <i className='fa fa-chevron-left'></i> Back to orders
                  </Link>
                </a>
              </div>
            ) : (
              <div className='text-center'>
                No orders currently avaliable to track
              </div>
            )}
          </article>
        )}
      </div>
    </>
  )
}

export default Tracking
