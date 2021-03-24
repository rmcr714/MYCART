import React from 'react'
// import StarRating from 'react-star-ratings'
import ReactStars from 'react-rating-stars-component'

const Star = ({ starClick, numberOfStars }) => {
  const secondExample = {
    size: 27,
    count: numberOfStars,
    color: 'black',
    activeColor: 'yellow',
    a11y: true,

    emptyIcon: <i className='far fa-star' />,
    halfIcon: <i className='fa fa-star-half-alt' />,
    filledIcon: <i className='fa fa-star' />,
    onChange: (newValue) => {
      starClick(newValue)
    },
  }
  return (
    <>
      {/* <StarRating
        changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starDimension='20px'
        starSpacing='2px'
        starRatedColor='red'
        starHoverColor='yellow'
        starEmptyColor='grey'
        starRatedColor='red'
        rating={numberOfStars}
      /> */}
      <ReactStars {...secondExample} />
      <br />
    </>
  )
}

export default Star
