import React, { useEffect, useState } from 'react'
import { getProducts } from '../../functions/product'
import ProductCard from '../../components/cards/ProductCard'
import LoadingCard from '../../components/cards/LoadingCard'
const NewArrivals = () => {
  //States
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    //sort,order,limit
    getProducts('createdAt', 'desc', 100)
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
      <h4 className='p-2 mt-2 mb-4 display-4 text-primary alert alert-primary'>
        New Arrivals
      </h4>
      {loading ? (
        <LoadingCard count={6} />
      ) : (
        <div className='container'>
          <div className='row'>
            {products.map((product) => (
              <div className='col-md-4 p-3' key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NewArrivals
