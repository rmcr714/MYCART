import React, { useState, useEffect } from 'react'
import { getCategory } from '../../functions/category'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/cards/ProductCard'

const CategoryHome = ({ match }) => {
  //state
  const [category, setCategory] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const { slug } = match.params

  useEffect(() => {
    setLoading(true)
    getCategory(slug).then((res) => {
      setCategory(res.data.category)
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
              <h4 className='text-center p-3 mt-5 mb-5 display-5 jumbotron'>
                No Products in {category.name} category
              </h4>
            ) : (
              <h4 className='text-center p-2 mt-5 mb-5 display-5 jumbotron'>
                {products.length} Products in "{category.name}" Category
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

export default CategoryHome
