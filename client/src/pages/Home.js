import React, { useEffect, useState } from 'react'
import { getProductsByCount } from '../functions/product'
import ProductCard from '../components/cards/ProductCard'
import LoadingCard from '../components/cards/LoadingCard' //to show card loading effect when the card data is loading
import Typewriter from 'typewriter-effect'

const Home = () => {
  //States
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = () => {
    setLoading(true)
    getProductsByCount(100)
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
      <div className='jumbotron text-primary h1 font-weight-bold text-center'>
        <Typewriter
          options={{
            strings: ['MY CART ', 'BEST SELLERS', 'NEW ARRIVALS'],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
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

export default Home
