import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    if (user && user.token) {
      history.push('/')
    }
  }, [user, history])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    }
    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail('')
        setLoading(false)
        toast.success('Check your email for password reset instructions')
      })
      .catch((error) => {
        toast.error(error.message)
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-3 p-5'>
          {loading ? (
            <h4 className='text-primary'>Loading....</h4>
          ) : (
            <h4>Forgot Password</h4>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type='email'
              className='form-control'
              value={email}
              placeholder='Type your email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              autoFocus
            />
            <br />
            <button type='submit' className='btn btn-raised' disabled={!email}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
