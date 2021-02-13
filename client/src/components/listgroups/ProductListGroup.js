import React from 'react'
import ProductModal from '../modal/ProductModal'

const ProductListGroup = ({ product }) => {
  return (
    <div>
      <ul className='list-group'>
        <li className='list-group-item'>
          <i
            className='fas fa-search-dollar fa-lg'
            style={{ color: 'red' }}
          ></i>
          <span className='text-danger h5'>Save extra</span>
        </li>
        <li className='list-group-item'>
          <span className='text-danger'>No Cost EMI:</span> Avail No Cost EMI
          orders above ₹3000<sup>*</sup> &nbsp;|{' '}
          <span
            className='btn btn-primary'
            data-toggle='modal'
            data-target='#details'
          >
            Details
          </span>
        </li>
        <li className='list-group-item'>
          <span className='text-danger'>Exchange Offer : </span> Avail No Cost
          Up to ₹ 19,400.00 off on Exchange
        </li>
        <li className='list-group-item'>
          <span className='text-danger'>Bank Offer (3): </span> Instant 10%
          <sup>*</sup> off on ICICI Bank Credit Cards
        </li>
        <li className='list-group-item'>
          <span>
            <i className='fas fa-undo-alt fa-lg text-success'></i>

            <i
              className='btn btn-primary'
              data-toggle='modal'
              data-target='#exampleModalLong'
            >
              7 day return policy
            </i>
          </span>
          <span>
            <i className='fas fa-truck fa-lg text-dark'></i>

            <button
              type='button'
              className='btn btn-primary'
              data-toggle='modal'
              data-target='#mycartdelivered'
            >
              My Cart Delivered
            </button>
          </span>
          <span className=' text-info'>
            <i className='fas fa-shield-alt fa-lg'></i>

            <button
              type='button'
              className='btn btn-primary'
              data-toggle='modal'
              data-target='#warrantypolicy'
            >
              Warranty Policy
            </button>
          </span>
        </li>
        {/* Modal */}
        <ProductModal price={product.price} />
      </ul>
      <hr />
      {product && product.quantity > 0 ? (
        <h5 className='text-success ml-2'>
          In Stock &nbsp;
          <br />
          <span className='text-danger h6'>Order Now and get it by </span>
          <i className='text-primary'>
            {new Date().toLocaleString('en-us', { weekday: 'long' })}
          </i>
        </h5>
      ) : (
        <h5 className='text-danger'>Out of stock</h5>
      )}
    </div>
  )
}

export default ProductListGroup
