import React from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import laptop from '../../images/laptop.png'
import { Card } from 'antd'
const { Meta } = Card

const AdminProductCard = ({ product }) => {
  const { title, description, images } = product

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
        <EditOutlined key='edit' className='text-primary' />,
        <DeleteOutlined className='text-danger' />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 70)} . . .`}
      />
    </Card>
  )
}

export default AdminProductCard
