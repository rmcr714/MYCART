import React, { useEffect, useState } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getUserOrders } from '../../functions/user'
import { useSelector } from 'react-redux'

import Invoice from '../../components/order/Invoice'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { LoadingOutlined } from '@ant-design/icons'

const History = ({ history }) => {
  const [orders, setOrders] = useState([])
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getUserOrders(user.token).then((res) => {
      console.log(res.data)
      setOrders(res.data.userOrders)
      setLoading(false)
    })
  }, [])

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName={'invoice' + order._id}
      className='btn btn-raised btn-danger btn-sm'
    >
      Download Invoice
    </PDFDownloadLink>
  )

  const showEachOrder = () =>
    orders.map((order, i) => (
      <div className='card mb-3'>
        <h6 className='text-center mt-2'>Order {order._id}</h6>
        {showOrderInTable(order, i)}
        <br />
        <br />
        <div className='card-footer'>
          <div className='text-center'>
            {' '}
            <div className='text-centre '> {showDownloadLink(order)}</div>
          </div>
          {order.couponApplied ? (
            <div className='h4 float-right'>
              Total Price After discount :${order.totalPrice}
            </div>
          ) : (
            <div className='h4 float-right'>
              total Price :${order.totalPrice}
            </div>
          )}
        </div>
      </div>
    ))

  const showTracking = (orderId) => {
    history.push(`/tracking/${orderId}`)
  }

  const showOrderInTable = (order, i) =>
    order.products.map((product) => (
      <div key={i} className='mt-3 ml-3  mr-3 card'>
        <div className='card-header bg-light'>
          <btton type='button' className='btn btn-raised btn-info'>
            OD{order._id}
          </btton>
          <button
            type='button'
            class='btn btn-raised active float-right'
            onClick={() => {
              showTracking(order._id)
            }}
          >
            <i className='fas fa-map-marker-alt text-info'></i>&nbsp;Track
          </button>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-2'>
              <div className='view zoom overlay z-depth-1 rounded mb-3 mb-md-0'>
                <img
                  className='img-fluid w-90'
                  src={product.product.images[0].url}
                  alt='Sample'
                />
              </div>
            </div>
            <div className='col-md-4'>
              <h5>{product.product.title}</h5>
              <p className='mb-2 text-muted  medium'>
                Color:{product.product.color}
              </p>
              <p className='mb-2 text-muted  medium'>Qantity:{product.count}</p>
              <p className='mb-2 text-muted  medium'>
                Coupons Applied:{order.couponApplied == true ? 1 : 0}
              </p>
              <p className='mb-2 text-muted  medium'>
                Brand:{product.product.brand}
              </p>
            </div>
            <div className='col-md-1'>
              $&nbsp;{product.product.price}
              <p className='mb-2 text-muted  medium '>OFFERS:1</p>
            </div>
            <div className='col-md-3 '>
              <h6>
                Delivery Date :{' '}
                {order.deliveredAt ? order.deliveredAt : 'To be Updated Soon'}
              </h6>
              {order.paymentIntent.status == 'succeeded' ? (
                <p className='mb-2 text-muted  medium'>
                  your order has been placed
                </p>
              ) : (
                <p className='mb-2 text-muted  medium'>
                  your order has not been placed
                </p>
              )}
              <p className='mb-2 text-muted  medium'>
                payment status : <span>{order.paymentIntent.status}</span>
              </p>

              <h6 className='mb-2  medium text-success'>
                Order status : {order.orderStatus}
              </h6>
            </div>
            <div className='col-md-1 offset-1'>
              <button type='button' class='btn btn-raised active float-right'>
                <i class='fas fa-times'></i>&nbsp;Cancel
              </button>
            </div>
          </div>
        </div>
        <div className='card-footer'>
          <p className=' text-muted  medium h6'>
            Ordered On:&nbsp;
            {<span className='h5'>{order.createdAt.substring(0, 10)}</span>}
          </p>
          <p className=' text-muted  medium h6 float-right'>
            Order total:&nbsp;
            {
              <span className='h5'>
                ${product.product.price * product.count}
              </span>
            }
          </p>
        </div>
      </div>
    ))
  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        {loading ? (
          <div className='text-center mt-4 '>
            {' '}
            <LoadingOutlined className='h1 text-primary' />
          </div>
        ) : (
          <div className='col mt-2 '>
            {orders.length > 0 ? (
              <h4>Your Orders</h4>
            ) : (
              <h4>'No orders avaiable'</h4>
            )}
            {orders.length > 0 && showEachOrder()}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
