import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { Avatar, Badge } from 'antd'
//loading icon
import { LoadingOutlined } from '@ant-design/icons'

import { useSelector } from 'react-redux'

const FileUpload = ({ values, setValues, setLoading, loading }) => {
  const { user } = useSelector((state) => ({ ...state }))

  const fileUploadAndResize = (e) => {
    let files = e.target.files
    let allUploadedFiles = values.images
    if (files) {
      setLoading(true)
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          'JPEG' || 'PNG',
          100,
          0,
          (uri) => {
            //
            axios
              .post(
                `/api/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authToken: user.token,
                  },
                }
              )
              .then((res) => {
                setLoading(false)
                allUploadedFiles.push(res.data)
                setValues({ ...values, images: allUploadedFiles })
              })
              .catch((err) => {
                setLoading(false)
                console.log('Cloudinary upload error', err)
              })
          },
          'base64'
        )
      }
    }
  }

  const removeImage = (public_id) => {
    setLoading(true)
    axios
      .post(
        '/api/removeimage',
        { public_id },
        {
          headers: {
            authToken: user.token,
          },
        }
      )
      .then((res) => {
        setLoading(false)
        const { images } = values
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id
        })

        setValues({ ...values, images: filteredImages })
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  return (
    <>
      {loading ? (
        <LoadingOutlined className='h3' />
      ) : (
        <div className='row'>
          {values.images &&
            values.images.map((image) => (
              <Badge
                count='x'
                key={image.public_id}
                onClick={() => {
                  removeImage(image.public_id)
                }}
                style={{ cursor: 'pointer' }}
              >
                <Avatar
                  shape='square'
                  src={image.url}
                  size={100}
                  className='ml-3 mb-3'
                />
              </Badge>
            ))}
        </div>
      )}
      <div className='row'>
        <label className='btn btn-primary btn-raised'>
          Choose File
          <input
            type='file'
            multiple
            accept='images/*'
            onChange={fileUploadAndResize}
            hidden
          ></input>
        </label>
      </div>
    </>
  )
}

export default FileUpload
