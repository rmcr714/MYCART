import React, { useState, useEffect } from 'react'
import AdminNav from '../../components/nav/AdminNav'
import { getOrders, changeStatus } from '../../functions/admin'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import OrderStatusUpdate from '../../components/order/OrderStatusUpdate'
const AdminDashboard = () => {
  //states
  const [orders, setOrders] = useState([])
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    getOrders(user.token).then((res) => {
      console.log(res.data)
      setOrders(res.data)
    })
  }, [])

  const handleStatusUpdate = (
    orderId,
    orderStatus,
    shippingBy,
    trackingId,
    deliveredAt
  ) => {
    if (window.confirm('Do u wanna update')) {
      changeStatus(
        orderId,
        orderStatus,
        shippingBy,
        trackingId,
        deliveredAt,
        user.token
      ).then((res) => {
        console.log('Successfully sent')
        getOrders(user.token).then((res) => {
          console.log(res.data)
          setOrders(res.data)
        })
      })
    }
  }

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col'>
          <h4 className='text-center'>Admin dashboard</h4>
          <br />
          <OrderStatusUpdate
            orders={orders}
            handleStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
