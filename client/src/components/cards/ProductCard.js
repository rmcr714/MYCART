import React, { useState } from 'react'
import {
  EyeOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import RatingsAverage from '../../functions/RatingsAverage'
import { Card, Tooltip } from 'antd'
import { userReducer } from '../../reducers/userReducer'
const { Meta } = Card

const ProductCard = ({ product }) => {
  const { title, description, images, slug, ratings } = product
  const [toolTip, setToolTip] = useState('click to add to cart')

  //redux
  const { user, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.push({ ...product, count: 1 })

      let unique = _.uniqBy(cart, '_id')

      localStorage.setItem('cart', JSON.stringify(unique))
      setToolTip('added to cart')

      //dispatch to redux i.e add the local storage(added to cart products) data to redux state
      dispatch({ type: 'ADD_TO_CART', payload: unique })
    }
  }
  return (
    <>
      <Card
        className='productcardhover'
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            style={{ height: '150px', objectFit: 'cover' }}
            className='p-1'
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            {' '}
            <EyeOutlined key='edit' className='text-primary' />
            <br />
            View Product
          </Link>,
          <Tooltip title={product.quantity > 0 ? toolTip : 'Out of stock'}>
            {product.quantity > 0 ? (
              <a
                onClick={() => {
                  handleAddToCart()
                }}
              >
                {' '}
                <ShoppingCartOutlined className='text-success' /> <br />
                Add to cart
              </a>
            ) : (
              <a>
                <ClockCircleOutlined className='text-danger' />
                <br />
                currently out of stock
              </a>
            )}
          </Tooltip>,
        ]}
      >
        <toolTip title={title}>
          <Meta
            title={title}
            description={`${description && description.substring(0, 70)} . . .`}
          />
        </toolTip>

        {product && product.ratings && ratings.length > 0 ? (
          <div className='pt-3 pb-1'>{RatingsAverage(product)}</div>
        ) : (
          <div className='pt-3 pb-2'>No Ratings yet</div>
        )}
        <h5 className='text-danger'>${product.price}</h5>
      </Card>
    </>
  )
}

export default ProductCard
