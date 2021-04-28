import React, { useEffect, useState } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getWishList, removeWishList } from '../../functions/user'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import '../css/user/wishlist.css'
import _ from 'lodash'
import { useDispatch } from 'react-redux'

const Wishlist = () => {
  const [wishList, setWishList] = useState([])
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    getWishList(user.token).then((res) => {
      console.log(res.data.wishlist)
      setWishList(res.data.wishlist)
      setLoading(false)
    })
  }, [])

  //add to cart
  const handleAddToCart = (product) => {
    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.push({ ...product, count: 1 })

      let unique = _.uniqWith(cart, _.isEqual)

      localStorage.setItem('cart', JSON.stringify(unique))

      //dispatch to redux i.e add the local storage(added to cart products) data to redux state
      dispatch({ type: 'ADD_TO_CART', payload: unique })

      //dispatch to show cart in side bar
      dispatch({ type: 'DRAWER_TOGGLE', payload: true })
    }
  }

  const removeProduct = (productId) => {
    setLoading(true)
    removeWishList(productId, user.token).then((res) => {
      getWishList(user.token).then((res) => {
        setWishList(res.data.wishlist)
        setLoading(false)
      })
    })
  }
  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>

        <div className='col-md-8'>
          <br />
          <h4>My Wishlist</h4>
          {}{' '}
          {loading ? (
            <div className='text-center mt-4 '>
              {' '}
              <LoadingOutlined className='h1 text-primary' />
            </div>
          ) : (
            <div>
              {wishList && wishList.length > 0 ? (
                wishList.map((product) => (
                  <div className='card card-body mb-3'>
                    <div className='media align-items-center align-items-lg-start text-center text-lg-left flex-column flex-lg-row'>
                      <div className='mr-2 mb-3 mb-lg-0'>
                        {' '}
                        <img
                          src={product.images[0].url}
                          width='85'
                          height='85'
                          alt=''
                        />{' '}
                      </div>
                      <div className='media-body'>
                        <h6 className='media-title font-weight-semibold'>
                          {' '}
                          <Link to={`/product/${product.slug}`}>
                            {product.title}
                          </Link>{' '}
                        </h6>
                        <ul className='list-inline list-inline-dotted mb-3 mb-lg-2'>
                          <li className='list-inline-item'>
                            <a href='#' className='text-muted' data-abc='true'>
                              {product.brand}
                            </a>
                          </li>
                        </ul>
                        <p className='mb-3'>{product.description}</p>
                        <h5 className='mb-0 font-weight-semibold'>
                          ${product.price}
                        </h5>
                      </div>
                      <div className='mt-3 mt-lg-0 ml-lg-3 text-center'>
                        <i
                          className='fas fa-trash'
                          onClick={() => {
                            removeProduct(product._id)
                          }}
                          style={{ cursor: 'pointer' }}
                        ></i>
                        <div> </div>
                        <br />
                        <br />

                        <button
                          type='button'
                          class='btn btn-raised'
                          style={{ backgroundColor: '#ff9f00' }}
                          onClick={() => {
                            handleAddToCart(product)
                          }}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h4 className='text-center'>No products in wish List</h4>
              )}
            </div>
          )}
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}

export default Wishlist
