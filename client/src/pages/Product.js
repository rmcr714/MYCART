import React, { useEffect, useState } from 'react'
import { getProduct } from '../functions/product'
import SingleProduct from '../components/cards/SingleProduct'
import { Link } from 'react-router-dom'

const Product = ({ match }) => {
  const [product, setProduct] = useState({})
  const { slug } = match.params

  useEffect(() => {
    loadSingleProduct()
  }, [slug])

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data)
    })
  }

  return (
    <>
      <Link to='/' className='button'>
        {' '}
        <button type='button' className='btn btn-dark mt-3 ml-2'>
          Go back
        </button>
      </Link>
      <div className='container-fluid'>
        <div className='row pt-2'>
          <SingleProduct product={product} />
        </div>
      </div>
      <div className='row p-3'>
        <div className='col ml-2 pt-5 pb-5'>
          <hr />
          <h4>Related Products</h4>
        </div>
      </div>
    </>
  )
}

export default Product
