import React from 'react'
import StarRating from 'react-star-ratings'

const RatingsAverage = (product) => {
  if (product && product.ratings) {
    let ratingsArray = product.ratings
    let total = []
    let numberOfRatings = ratingsArray.length

    ratingsArray.map((rating) => {
      total.push(rating.star)
    })

    let totalReduced = total.reduce((prev, next) => prev + next, 0)

    let averageRating = totalReduced / numberOfRatings

    return (
      <div>
        <span>
          <StarRating
            rating={averageRating}
            starRatedColor='gold'
            starDimension='25px'
            starSpacing='2px'
          />
          &nbsp;({product.ratings.length})
        </span>
      </div>
    )
  }
}

export default RatingsAverage
