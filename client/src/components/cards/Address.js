import React from 'react'
import { deleteAddress } from '../../functions/user'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'

const Address = ({ data, setSavedAddress, addressSaved, authToken }) => {
  const { userAddress } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  let { _id, ...selectedAddress } = data

  //remove an address
  const removeAddress = () => {
    console.log(data)

    const wannaDelete = window.confirm('do u wanna delete this address')
    if (wannaDelete) {
      deleteAddress(authToken, data).then((res) => {
        console.log(res)
        if ((res.data = 'ok')) {
          toast.success('Address successfully deleted')
          setSavedAddress(!addressSaved)
        } else if (res.data == null) {
          toast.error('oops something went wrong, try again later')
        }
      })
    }
  }

  //select an address for delivery
  const selectAddress = () => {
    dispatch({ type: 'CHECKOUT_ADDRESS_SAVED', payload: selectedAddress })
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <strong className='card-title h5'>
          {data.firstName}&nbsp; {data.lastName}
        </strong>
        <p className='card-text'>{data.address}</p>
        <p className='card-text'>{data.zip}</p>
        <p className='card-text'>{data.city}</p>
        <p className='card-text'>{data.state}</p>
        <p className='card-text'>{data.phone}</p>
        <button
          type='button'
          className='text-center btn btn-primary btn-raised btn-block'
          onClick={() => selectAddress()}
        >
          Deliver to this address
        </button>
        <button
          type='button'
          className='text-center btn btn-danger btn-raised btn-sm mt-3'
          onClick={() => removeAddress()}
        >
          Delete address
        </button>
      </div>
    </div>
  )
}

export default Address
