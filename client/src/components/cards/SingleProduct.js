import React from 'react'
import { Card, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import ProductListItems from './ProductListItems'
const { Meta } = Card
const { TabPane } = Tabs

const SingleProduct = ({ product }) => {
  const { title, images, description } = product
  return (
    <>
      <div className='col-md-6 ml-4 mt-3'>
        <Card>
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images && images.map((data) => <img src={data.url} />)}
          </Carousel>
          <br />

          <Tabs type='card'>
            <TabPane tab='Description' key='1'>
              {description && description}
            </TabPane>
            <TabPane tab='Specification' key='2'>
              ram : 8gb
              <br />
              processor : corei7 8th gen
              <br />
              Gpu : Nividia Gtx 1080
              <br />
              cache : 10mb of l1 cache
              <br />
            </TabPane>
            <TabPane tab='Seller info'>
              Anurag mart near pluto , next to kepler belt, pin : solar294745
              <br />
              phone : solar98377656
            </TabPane>
          </Tabs>
        </Card>
      </div>
      <div className='col-md-5 ml-2 mt-3'>
        <Card
          className='productcard'
          actions={[
            <>
              <ShoppingCartOutlined className='text-success' /> <br />
              Add to Cart
            </>,
            <Link to='/'>
              <HeartOutlined className='text-danger' />
              <br />
              Add to wishlist
            </Link>,
          ]}
        >
          <Meta title={title} />
          <hr />
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  )
}

export default SingleProduct
