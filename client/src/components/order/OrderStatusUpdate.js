import React, { useState } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const OrderStatusUpdate = ({ orders, handleStatusUpdate }) => {
  const [deliveryStatus, setDeliveryStatus] = useState('Not Processed')
  const [shippingBy, setShippingBy] = useState('Yet to assign')
  const [trackingId, setTrackingId] = useState('yet to be assigned')
  return (
    <>
      {orders.map((order) => (
        <div key={order._id} className='row pb-5 card mr-4'>
          <p>
            <span className='h6'>Order Id :{order._id}</span>
            <span className='ml-5 h6 '>
              Transaction Id : {order.paymentIntent.id}
            </span>
            <span className='ml-5 h6'>Amount : ${order.totalPrice}</span>

            <span className='ml-5 h6'>Method:{order.paymentMethod}</span>
            <span className='ml-5 h6 '>
              Payment : {order.paymentIntent.status}
            </span>
            <span className='ml-5 h6 '>Ordered on : {order.createdAt}</span>
            <span className='ml-5 h6 alert-success'>
              status : {order.orderStatus}
            </span>
          </p>

          <table className='table table-striped ml-1 mr-4'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, i) => (
                <tr key={i}>
                  <td>{product.product.title}</td>
                  <td>${product.product.price}</td>
                  <td>{product.count}</td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='row ml-2'>
            <div className='col-md-4 h5'>Delivery Status</div>
            <div className='col-md-8'>
              <select
                onChange={(e) => {
                  setDeliveryStatus(e.target.value)
                }}
                value={deliveryStatus}
              >
                <option value='Not Processed'>Not Processed</option>
                <option value='Processing'>Processing</option>
                <option value='Dispatched'>Dispatched</option>
                <option value='Cancelled'>Cancelled</option>
                <option calue='Completed'>Completed</option>
              </select>
            </div>
            <br />
            <div className='col-md-4 h5'>Shipping By</div>
            <div className='col-md-8'>
              <select
                onChange={(e) => {
                  setShippingBy(e.target.value)
                }}
                value={shippingBy}
              >
                <option value='Yet to assign'>Yet to assign</option>
                <option value='BLUEDART'>BLUEDART</option>
                <option value='DHL'>DHL</option>
                <option value='FEDEX'>FEDEX</option>
                <option calue='WHL'>WHL</option>
              </select>
            </div>
            <div className='col-md-4 h5'>Shipping By</div>
            <div className='col-md-8'>
              <input
                type='text'
                onChange={(e) => {
                  setTrackingId(e.target.value)
                }}
                value={trackingId}
              ></input>
            </div>
            <br />
            <button
              type='button'
              className='btn btn-raised text-center mt-3 btn-danger'
              onClick={(e) => {
                handleStatusUpdate(
                  order._id,
                  deliveryStatus,
                  shippingBy,
                  trackingId
                )
                setDeliveryStatus('Not Processed')
                setShippingBy('Yet to assign')
                setTrackingId('yet to be assigned')
              }}
            >
              Update Order Details
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default OrderStatusUpdate
