import React from 'react'
import { Drawer, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import laptop from '../../images/laptop.png'

const SideDrawer = () => {
  //redux
  const { drawer, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const imageStyle = {
    width: '100%',
    height: '50px',
    objectFit: 'cover',
  }
  return (
    <Drawer
      visible={drawer}
      onClose={() => {
        dispatch({ type: 'DRAWER_TOGGLE', payload: false })
      }}
      className='mt-5 text-center'
      title={`Cart (${cart.length} items)`}
      closable={false}
    >
      {cart.map((p) => (
        <div className='row mb-2' key={p._id}>
          <div className='col'>
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle}></img>
                <p className='form-text  text-center'>
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={laptop} style={imageStyle}></img>
                <p className='form-text text-muted text-center'>
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to={`/cart`}>
        <button
          onClick={() => dispatch({ type: 'DRAWER_TOGGLE', payload: false })}
          className='text-center btn btn-primary btn-raised btn-block'
        >
          Go to Cart
        </button>
      </Link>
    </Drawer>
  )
}

export default SideDrawer
