import React, { useEffect, useState } from 'react'
import { getProductsByCount, fetchProductsByFilter } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'
import { LoadingOutlined } from '@ant-design/icons'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  //1.load default products when no search is done
  useEffect(() => {
    loadAllProducts()
  }, [])

  //2. load products on user search input( on text change)
  useEffect(() => {
    if (text === '') {
      loadAllProducts()
    }
    const delayed = setTimeout(() => {
      fetchProducts({ query: text })
    }, 1000)
    return () => clearTimeout(delayed)
  }, [text])

  //fetching products based on search criteria
  const fetchProducts = (arg) => {
    setLoading(true)
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data)
    })
    setLoading(false)
  }

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
              <div className='col-md-4 mb-4' key={p._id}>
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
