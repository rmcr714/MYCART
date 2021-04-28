import React, { useState } from 'react'
import UserNav from '../../components/nav/UserNav'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'

const Password = () => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false)
        setPassword('')
        toast.success('password successfully updated')
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.message)
      })
  }

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Your Password</label>
        <input
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
          placeholder='Enter new Password'
          value={password}
          disabled={loading}
        />
        <button
          className='btn btn-primary'
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  )

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col-md-4 p-3'>
          {loading ? (
            <h3 className='text-danger'>Loading...</h3>
          ) : (
            <h3>Password Update</h3>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}

export default Password
