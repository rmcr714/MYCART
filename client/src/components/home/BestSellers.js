import React, { useEffect, useState } from 'react'
import { getProducts, getProductsCount } from '../../functions/product'
import ProductCard from '../../components/cards/ProductCard'
import LoadingCard from '../../components/cards/LoadingCard'
import { Pagination } from 'antd'
const BestSellers = () => {
  //States
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [productsCount, setProductsCount] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadAllProducts()
  }, [page])

  useEffect(() => {
    getProductsCount().then((res) => {
      setProductsCount(res.data)
    })
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    //sort,order,limit
    console.log('Inside best seller')
    getProducts('sold', 'desc', page)
      .then((res) => {
        setLoading(false)
        setProducts(res.data)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  return (
    <>
      <h4 className='p-2 mt-2  ml-2 display-4 text-primary '>Best Sellers</h4>
      {loading ? (
        <LoadingCard count={3} />
      ) : (
        <div className='container'>
          <div className='row'>
            {products.map((product) => (
              <div className='col-md-4 ' key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='row'>
        <nav className='col-md-4 offset-md-4 text-center pt-2 p-3'>
          <Pagination
            defaultCurrent={1}
            total={(productsCount / 3) * 10}
            onChange={(value) => setPage(value)}
          />
        </nav>
      </div>
    </>
  )
}

export default BestSellers
