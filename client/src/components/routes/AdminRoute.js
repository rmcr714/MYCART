import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
import { currentAdmin } from '../../functions/auth'

/*this component is used to access the private routes and we will pass the routes that we want to make private
i.e people cant access it without logging in(when they login their token gets saved in user state) and without being an admin
eg in app.js if we have a route /user/history and we want only the logged in person to access it then we cann
make it private by replacing <Route to = /user/history component = {}.../> by <adminRoute to = ......./>.
thats it it becomes private 

actually this same thing can be done by just checking in useEffect if the person is logged in and is an admin or not and if not then
redirect him to login page or dont allow him access . But this one makes it easier and is reusable so we dont need to write the same code in
useEffect of each component

this ones making request to backend in useEffect to check if the user is an admin or not

tip: just copy paste it in ur projects if u want this kind of functionality, dont waste time understanding it although its fairly easy

more info : https://reactrouter.com/web/example/auth-workflow

*/

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log('Current User is admin', res)
          setOk(true)
        })
        .catch((err) => {
          console.log('Admin route Error', err)
          setOk(false)
        })
    }
  })

  return ok ? <Route {...rest} /> : <LoadingToRedirect />
}

export default AdminRoute
