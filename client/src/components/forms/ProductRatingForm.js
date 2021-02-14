import React from 'react'
import StarRating from 'react-star-ratings'

const ProductRatingForm = ({ _id }) => {
  return (
    <>
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

      <form>
        <div className='form-group'>
          <label for='comment' className='h5'>
            Comment
          </label>
          <hr />
          <textarea className='form-control' name='comment' rows='5'></textarea>
        </div>
      </form>
    </>
  )
}

export default ProductRatingForm
