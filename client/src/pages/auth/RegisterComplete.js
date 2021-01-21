import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { createOrUpdateUser } from '../../functions/auth'

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    //Manul validation
    if (!email || !password) {
      toast.error('Email and password is required')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be atleast 6 characters long')
      return
    }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href)
      console.log('RESULT', result)

      if (result.user.emailVerified) {
        //remove user email from local storage
        window.localStorage.removeItem('emailForRegistration')

        //get user id token
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()

        // console.log('user', user, 'idtoke ', idTokenResult)

        //calling the function to send token to backend and setting data in redux store
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
          })
          .catch((error) => {})

        //Redirect
        history.push('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type='email' className='form-control' value={email} disabled />
      <br />
      <input
        type='password'
        className='form-control'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        placeholder='Set Password'
      />
      <br />
      <button type='submit' className='btn btn-raised'>
        Complete registration
      </button>
    </form>
  )

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register Complete</h4>

          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  )
}

export default RegisterComplete
