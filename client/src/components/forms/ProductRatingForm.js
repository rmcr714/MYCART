import React from 'react'
import StarRating from 'react-star-ratings'
import { Card } from 'antd'
const ProductRatingForm = ({ _id }) => {
  return (
    <>
      <Card>
        <form className='ml-3'>
          <div className='form-group'>
            <label for='rating' className='h4'>
              Rating
            </label>

            <hr />
            <StarRating
              name={_id}
              numberOfStars={5}
              rating={2}
              changeRating={(newRating, name) =>
                console.log('newRating', newRating, 'name', name)
              }
              isSelectable={true}
              starRatedColor='gold'
            />
          </div>
          <div className='form-group'>
            <label for='comment' className='h5'>
              Comment
            </label>
            <hr />
            <textarea
              className='form-control'
              name='comment'
              rows='5'
            ></textarea>
          </div>
        </form>
      </Card>
    </>
  )
}

export default ProductRatingForm
