import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { StarOutlined } from '@ant-design/icons'
import { useHistory,useParams } from 'react-router-dom'

const RatingModal = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [modalVisible, setModalVisible] = useState(false)

  const history = useHistory()
  const params = useParams()

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true)
    } else {
      history.push({
        pathname:'/login',
        state:{from:`/product/${params.slug}`}
      })
    }
  }

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined style={{ color: 'gold' }} />
        <br />
        {user ? 'Leave a rating' : 'login to rate this product'}
      </div>
      <Modal
        title='Leave your rating'
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false)
          toast.success('Thanks for your review!!, it will appear soon')
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  )
}

export default RatingModal
