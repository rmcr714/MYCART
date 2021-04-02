import React, { useEffect, useState } from 'react'
import { getProduct, productStar, getRelated } from '../functions/product'
import SingleProduct from '../components/cards/SingleProduct'
import ProductCard from '../components/cards/ProductCard'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Product = ({ match }) => {
  //local state
  const [product, setProduct] = useState({})
  const [related, setRelated] = useState({})
  const [star, setStar] = useState(0)
  const [comment, setComment] = useState('')

  const { user } = useSelector((state) => ({ ...state }))

  const { slug } = match.params

  useEffect(() => {
    loadSingleProduct()
  }, [slug])

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString()
      )

      if (existingRatingObject) {
        setComment(existingRatingObject.comment)
        setStar(existingRatingObject.star)
      }
    }
  }, [product, user])

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data)
      //after getting the product, get the related products(products of the same category)
      getRelated(res.data._id).then((res) => {
        setRelated(res.data)
      })
    })
  }

  const onStarClick = (newRating, name) => {
    setStar(newRating)
  }

  const userComment = (e) => {
    setComment(e.target.value)
  }

  const reviewSubmit = () => {
    productStar(product._id, star, comment, user.token)
      .then((res) => {
        toast.success('Thank you for the review, it will appear soon')
        loadSingleProduct()
      })
      .catch((err) => {
        toast.error(err)
      })
  }

  return (
    <>
      <Link to='/' className='button'>
        {' '}
        <button type='button' className='btn btn-dark mt-5 ml-2'>
          Go back
        </button>
      </Link>
      <div className='container-fluid'>
        <div className='row pt-2'>
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
            userComment={userComment}
            comment={comment}
            reviewSubmit={reviewSubmit}
          />
        </div>
      </div>
      <div className='row p-1'>
        <div className='col ml-2 pt-5 pb-4 pl-4'>
          <hr />
          <h3>Similar Products</h3>
        </div>
      </div>
      <div className='row pl-4'>
        {related.length > 0 ? (
          related.map((item) => (
            <div key={item._id} className='col-md-4 pb-4  pr-2'>
              <ProductCard product={item} />
            </div>
          ))
        ) : (
          <div className='text-center col pb-3 h5'>No related products</div>
        )}
      </div>
    </>
  )
}

export default Product
