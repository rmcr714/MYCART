import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { getCategories } from '../../functions/category'
import { toast } from 'react-toastify'

const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCategories()
      .then((c) => {
        setCategories(c.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        if (err.response.status === 400) {
          toast.error(err.response.data)
        }
      })
  }, [])

  const showCategories = () => (
    <>
      <div className='col-md-3 offset-1 '>
        <div className='text-center text-primary'>
          {' '}
          <i className='fas fa-mobile-alt fa-3x'></i>
        </div>
        <br />
        <div className='btn bt-outlined-primary btn-md btn-block btn-raised '>
          <Link to={`/category/${categories[1].slug}`}>
            {' '}
            {categories[1].name}
          </Link>
        </div>
      </div>
      <div className='col-md-3 offset-1'>
        <div className='text-center text-primary'>
          <i className='fas fa-laptop fa-3x'></i>
        </div>
        <br />
        <div className='btn bt-outlined-primary btn-md btn-block btn-raised '>
          <Link to={`/category/${categories[2].slug}`}>
            {' '}
            {categories[2].name}
          </Link>
        </div>
      </div>
      <div className='col-md-3 offset-1'>
        <div className='text-center text-primary'>
          {' '}
          <i className='fas fa-tablet-alt fa-3x '></i>
        </div>
        <br />
        <div className='btn bt-outlined-primary btn-md btn-block btn-raised '>
          <Link to={`/category/${categories[0].slug}`}>
            {' '}
            {categories[0].name}
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <div className='container-fluid'>
      {/* <h5 className='p-2 mt-2 mb-4 ml-2 display-4 text-dark text-center alert-dark'>
        Categories
      </h5> */}
      <br />
      <div className='row'>
        {loading || categories.length === 0 ? (
          <LoadingOutlined className='h1 text-primary' />
        ) : (
          showCategories()
        )}
      </div>
    </div>
  )
}

export default CategoryList
