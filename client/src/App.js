import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' //css for toastify pop ups

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Header from './components/nav/Header'
import RegisterComplete from './pages/auth/RegisterComplete'
import ForgotPassword from './pages/auth/ForgotPassword'
import History from './pages/user/History'
import UserRoute from './components/routes/UserRoute'
import Password from './pages/user/Password'
import Wishlist from './pages/user/Wishlist'

import { auth } from './firebase'
import { useDispatch } from 'react-redux'
import { currentUser } from './functions/auth'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        // console.log('user ', user)
        currentUser(idTokenResult.token)
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
          .catch((error) => {
            toast.error(error.message)
          })
      }
    })

    //unsubscribe

    return () => unsubscribe()
  }, [])

  return (
    <Router>
      <Header />
      <ToastContainer />
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/login' component={Login} exact />
        <Route path='/register' component={Register} exact />
        <Route path='/register/complete' component={RegisterComplete} exact />
        <Route path='/forgot/password' component={ForgotPassword} exact />
        <UserRoute path='/user/history' component={History} exact />
        <UserRoute path='/user/password' component={Password} exact />
        <UserRoute path='/user/wishlist' component={Wishlist} exact />
      </Switch>
    </Router>
  )
}

export default App
