import React from 'react'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
const { Meta } = Card

const ProductCard = ({ product }) => {
  const { title, description, images, slug } = product
  return (
    <Card
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
        <>
          {' '}
          <ShoppingCartOutlined className='text-success' /> <br />
          Add to cart
        </>,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 70)} . . .`}
      />
    </Card>
  )
}

export default ProductCard
