import React, { useState, useEffect } from 'react'
import { auth, googleAuthProvider } from '../../firebase'
import { toast } from 'react-toastify'
import { Button } from 'antd'

import { GoogleOutlined, MailOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import Loader from '../../components/Loader'
import { createOrUpdateUser } from '../../functions/auth'

const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    if (user && user.token) {
      history.push('/')
    }
  }, [user, history])

  //role based redirect
  const roleBasedRedirect = (res) => {
    if (res.data.role === 'admin') {
      history.push('/admin/dashboard')
    } else {
      history.push('/user/history')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await auth.signInWithEmailAndPassword(email, password)
      // console.log(result)
      const { user } = result
      const idTokenResult = await user.getIdTokenResult()

      //calling the function to send token to backend
      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              name: res.data.name,
              email: user.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          })
          roleBasedRedirect(res)
        })
        .catch((error) => {
          toast.error(error.message)
        })
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

        //calling the function to send token to backend
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: user.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            })
            roleBasedRedirect(res)
          })
          .catch((error) => {
            toast.error(error.message)
          })
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
        className='mb-2'
        block
        shape='round'
        icon={<MailOutlined />}
        size='large'
        disabled={!email || password.length < 6}
      >
        Login with email/password
      </Button>
      <Link to='/forgot/password' className='float-right mb-3'>
        Forget Password ?
      </Link>
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
