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
  const [coupons, setCoupons] = useState([])

  //redux
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    getCoupons().then((res) => setCoupons(res.data))
  }, [loading])

  //create a new coupon
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(expiry, name, discount)

    createCoupon({ name, expiry, discount }, user.token)
      .then(
        (res) => setLoading(false),
        setName(''),
        setDiscount(0),
        setExpiry(new Date()),

        toast.success('successfully created'),
        setLoading(!loading)
      )
      .catch((err) => {
        toast.error('Unsuccessful operation')
      })
  }

  //remove a coupon
  const handleRemove = (couponId) => {
    if (window.confirm('Delete?')) {
      removeCoupon(couponId, user.token)
        .then((res) => {
          getCoupons().then((res) => setCoupons(res.data))
          toast.success(`coupon ${res.data.name} Delelted successfully`)
          setLoading(!loading)
        })
        .catch((err) => {
          toast.error('oops!,something wrong happened')
        })
    }
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
          <br />
          <h4> {coupons.length} Coupons</h4>
          <table className='table table-bordered'>
            <thead className='thead-light'>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Expiry</th>
                <th scope='col'>Discount</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td>
                    {
                      <DeleteOutlined
                        className='text-danger '
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleRemove(c._id)
                        }}
                      />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CreateCoupon
