import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserNav = () => {
  //redux
  const { user } = useSelector((state) => ({ ...state }))
  return (
    <>
      <div className='card mt-4 pb-3 pl-2 pt-2'>
        <div className='row'>
          <div className='col-md-2 mt-3 ml-2'>
            <span className='text-info'>
              <i className='fas fa-user-circle fa-2x'></i>
            </span>
          </div>
          <div className='col-md-8 pt-2'>
            <h6 className='text-muted small'>hello</h6>
            {user && user.name ? (
              <h6 className='medium'>{user.name}</h6>
            ) : (
              <h5>{user.email}</h5>
            )}
          </div>
        </div>
      </div>
      <nav className='card mt-4'>
        <ul className='nav flex-column'>
          <li className='nav-item'>
            <Link to='/user/history' className='nav-link'>
              <i className='fas fa-box-open'></i> History
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/user/password' className='nav-link'>
              <i className='fas fa-key'></i> Password
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/user/wishlist' className='nav-link'>
              <i className='fas fa-heart'></i> wishlist
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default UserNav
