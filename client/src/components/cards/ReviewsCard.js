import React from 'react'

import Rating from './Rating'
import InternalPreviewGroup from 'antd/lib/image/PreviewGroup'

const ReviewsCard = ({ratings}) => {
    return (
        <>
        <div className = 'row'>
            <div className = 'col-md-10'>
        <h2 className = 'ml-2'>Customer Reviews</h2>
        <span className = 'btn btn-sm ml-2 text-dark' data-toggle="collapse" href="#collapseExample" 
        role="button" aria-expanded="false" aria-controls="collapseExample"> <i class="fas fa-chevron-up"></i>&nbsp;collpase/expand</span>
        
        <div className="collapse show ml-2" id="collapseExample">
        <div className = 'list-group'>
            {ratings && ratings.length > 0? ratings.map((review)=>(
                <div className = 'card bg-light mb-3' key = {review._id}>
                    <div className = 'card-body'>
                    <Rating value = {review.star}/>
                    <p>{review.createdAt.substring(0,10)}</p>
                    <p>{review.comment}</p>
                    <p className = 'text-right'><strong>{review.name}</strong></p>
                    </div>
                </div>

            )):
            <div className = 'card'>
                <h5>No reviews available</h5>
                </div>}
            
        </div>
        </div>
        </div>
        </div>
        </>
    )
}

export default ReviewsCard
