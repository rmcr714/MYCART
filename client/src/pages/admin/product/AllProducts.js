import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getProductsByCount, removeProduct } from '../../../functions/product'
import { LoadingOutlined } from '@ant-design/icons'
import AdminProductCard from '../../../components/cards/AdminProductCard'

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    getProductsByCount(100)
      .then((res) => {
        console.log(res)
        setLoading(false)
        setProducts(res.data)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const handleRemove = (slug) => {
    let answer = window.confirm('Are u sure u want to delete this product')
    if (answer) {
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts()
          toast.error(`${res.data.title} is deleted successfully`)
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error(err.response.data)
          }
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
          {' '}
          {loading ? (
            <LoadingOutlined className='h1 text-primary' />
          ) : (
            <h3>All Products </h3>
          )}
          <div className='row'>
            {products.map((product) => (
              <div className='col-md-4 pb-3' key={product._id}>
                {' '}
                <AdminProductCard
                  product={product}
                  handleRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllProducts
