import React, { useState, useEffect } from 'react'
import { getSub } from '../../functions/sub'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/cards/ProductCard'
import { Card } from 'antd'

const SubHome = ({ match }) => {
  //state
  const [sub, setSub] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const { slug } = match.params

  useEffect(() => {
    setLoading(true)
    getSub(slug).then((res) => {
      setSub(res.data.sub)
      setProducts(res.data.products)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Link to='/' className='button'>
        {' '}
        <button type='button' className='btn btn-dark mt-3 ml-2'>
          Go back
        </button>
      </Link>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            {loading ? (
              <LoadingOutlined className='h1 text-primary' />
            ) : products.length === 0 ? (
              <h4 className='text-center p-3 mt-3 mb-5 display-5 jumbotron'>
                No Products in {sub.name} sub category
              </h4>
            ) : (
              <h4 className='text-center p-2 mt-3 mb-5 display-5 jumbotron'>
                {products.length} Products in "{sub.name}" sub Category
              </h4>
            )}
          </div>
        </div>
        <div className='row'>
          {products &&
            products.length > 0 &&
            products.map((p) => (
              <div className='col-md-4 pb-5 ' key={p._id}>
                {<ProductCard product={p} />}
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default SubHome
