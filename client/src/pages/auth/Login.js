import React, { useState } from 'react'
import { auth, googleAuthProvider } from '../../firebase'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import { GoogleOutlined, MailOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import Loader from '../../components/Loader'

const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await auth.signInWithEmailAndPassword(email, password)
      // console.log(result)
      const { user } = result
      const idTokenResult = await user.getIdTokenResult()

      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          email: user.email,
          token: idTokenResult.token,
        },
      })
      history.push('/')
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result
        const idTokenResult = await user.getIdTokenResult()
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        })
        history.push('/')
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          value={email}
          placeholder='Enter your email'
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          autoFocus
        />
      </div>
      <br />
      <div className='form-group'>
        <input
          type='password'
          className='form-control'
          value={password}
          placeholder='Enter your password'
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>

      <Button
        type='primary'
        onClick={handleSubmit}
        className='mb-3'
        block
        shape='round'
        icon={<MailOutlined />}
        size='large'
        disabled={!email || password.length < 6}
      >
        Login with email/password
      </Button>
    </form>
  )

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          {loading ? (
            <h4 className='text-primary'>Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}

          {loginForm()}

          <Button
            type='danger'
            onClick={googleLogin}
            className='mb-3'
            block
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
          >
            Login with google
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
