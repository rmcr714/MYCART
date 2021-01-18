import React, { useState } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
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
          <h4>Login</h4>

          {loginForm()}
        </div>
      </div>
    </div>
  )
}

export default Login
