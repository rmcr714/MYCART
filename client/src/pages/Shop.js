import React, { useEffect, useState } from 'react'
import { getProductsByCount } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'
import { LoadingOutlined } from '@ant-design/icons'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    getProductsByCount(12).then((p) => setProducts(p.data))
    setLoading(false)
  }

  return (
    <div className='container-fluid mt-5'>
      <br />
      <div className='row'>
        <div className='col-md-3'>search/filter menu</div>

        <div className='col-md-9'>
          {loading ? (
            <LoadingOutlined className='h1 text-primary' />
          ) : (
            <h3> Products </h3>
          )}
          {products.length < 1 && <p>No products found</p>}
          <div className='row'>
            {products.map((p) => (
              <div className='col-md-4 mb-3' key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
