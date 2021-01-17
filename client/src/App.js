import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' //css for toastify pop ups

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Header from './components/nav/Header'
import RegisterComplete from './pages/auth/RegisterComplete'

import { auth } from './firebase'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        // console.log('user ', user)
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
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
      </Switch>
    </Router>
  )
}

export default App
