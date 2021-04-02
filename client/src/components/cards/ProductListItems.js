import React from 'react'
import { Link } from 'react-router-dom'
const ProductListItems = ({ product }) => {
  const {
    price,
    category,
    subs,
    shipping,
    color,
    brand,
    quantity,
    sold,
  } = product
  return (
    <ul className='list-group'>
      <li className='list-group-item h5 font-italic'>
        Price{' '}
        <span className='label label-default label-pill pull-xs-right '>
          ${price}{' '}
          {/* <span className='text-danger h6'> &nbsp;&nbsp;you save 20%</span>
          <del>${price + (20 / 100) * price}</del> */}
        </span>
      </li>

      {category && (
        <li className='list-group-item h5 font-italic'>
          Category{' '}
          <Link
            to={`/category/${category.slug}`}
            className='label label-default label-pill pull-xs-right '
          >
            {category.name}
          </Link>
        </li>
      )}

      {subs && (
        <li className='list-group-item h5 font-italic'>
          SubCategories{' '}
          {subs.map((s) => (
            <Link
              to={`/sub/${s.slug}`}
              key={s._id}
              className='label label-default label-pill pull-xs-right'
            >
              {s.name}
            </Link>
          ))}
        </li>
      )}
      <li className='list-group-item h5 font-italic'>
        Shipping{' '}
        <span className='label label-default label-pill pull-xs-right '>
          {shipping}
        </span>
      </li>
      <li className='list-group-item h5 font-italic'>
        Color{' '}
        <span className='label label-default label-pill pull-xs-right '>
          {color}
        </span>
      </li>
      <li className='list-group-item h5 font-italic'>
        Brand{' '}
        <span className='label label-default label-pill pull-xs-right '>
          {brand}
        </span>
      </li>
      {/* <li className='list-group-item h5 font-italic'>
        Available{' '}
        <span className='label label-default label-pill pull-xs-right '>
          {quantity}
        </span>
      </li>
      <li className='list-group-item h5 font-italic'>
        Sold{' '}
        <span className='label label-default label-pill pull-xs-right '>
          {sold}
        </span>
      </li> */}
    </ul>
  )
}

export default ProductListItems
