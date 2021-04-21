import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DeleteOutlined } from '@ant-design/icons'
import AdminNav from '../../../components/nav/AdminNav'
import {
  createCoupon,
  removeCoupon,
  getCoupons,
} from '../../../functions/coupon'

const CreateCoupon = () => {
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState(new Date())
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  //redux
  const { user } = useSelector((state) => ({ ...state }))

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(expiry, name, discount)
    setLoading(true)
    createCoupon({ name, expiry, discount }, user.token)
      .then(
        (res) => setLoading(false),
        setName(''),
        setDiscount(0),
        setExpiry(new Date()),
        toast.success('successfully created')
      )
      .catch((err) => {
        toast.error('Unsuccessful operation')
      })
  }

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4>Coupon</h4>
          <br />
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label className='text-muted'>Name</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              ></input>
            </div>
            <div className='form-group'>
              <label className='text-muted'>Discount</label>
              <input
                type='number'
                className='form-control'
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                min={0}
                max={100}
                required
              ></input>
            </div>
            <br />
            <div className='form-group'>
              <label className='text-muted'>Expiry Date</label>
              <br />
              <DatePicker
                className='form-control '
                selected={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>
            <button className='btn btn-outline-primary'>Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCoupon
