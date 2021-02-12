import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' //css for toastify pop ups

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Header from './components/nav/Header'
import Footer from './components/nav/Footer'
import RegisterComplete from './pages/auth/RegisterComplete'
import ForgotPassword from './pages/auth/ForgotPassword'
import History from './pages/user/History'
import UserRoute from './components/routes/UserRoute'
import AdminRoute from './components/routes/AdminRoute'
import Password from './pages/user/Password'
import Wishlist from './pages/user/Wishlist'
import AdminDashboard from './pages/admin/AdminDashboard'
import CategoryCreate from './pages/admin/category/CategoryCreate'
import CategoryUpdate from './pages/admin/category/CategoryUpdate'
import SubCreate from './pages/admin/sub/SubCreate'
import SubUpdate from './pages/admin/sub/SubUpdate'
import ProductCreate from './pages/admin/product/ProductCreate'
import AllProducts from './pages/admin/product/AllProducts'
import ProductUpdate from './pages/admin/product/ProductUpdate'
import Product from './pages/Product'

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
  }, [dispatch])

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
        <AdminRoute path='/admin/dashboard' component={AdminDashboard} exact />
        <AdminRoute path='/admin/category' component={CategoryCreate} exact />
        <AdminRoute
          path='/admin/category/:slug'
          component={CategoryUpdate}
          exact
        />
        <AdminRoute path='/admin/sub' component={SubCreate} exact />
        <AdminRoute path='/admin/sub/:slug' component={SubUpdate} exact />
        <AdminRoute path='/admin/product' component={ProductCreate} exact />
        <AdminRoute path='/admin/products' component={AllProducts} exact />
        <AdminRoute
          path='/admin/product/:slug'
          component={ProductUpdate}
          exact
        />
        <Route path='/product/:slug' component={Product} exact />{' '}
      </Switch>
      <Footer />
    </Router>
  )
}

export default App
