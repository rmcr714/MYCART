import React from 'react'
import { Route, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'

/*this component is used to access the private routes and we will pass the routes that we want to make private
i.e people cant access it without logging in(when they login their token gets saved in user state)
eg in app.js if we have a route /user/history and we want only the logged in person to access it then we cann
make it private by replacing <Route to = /user/history component = {}.../> by <userRoute to = ......./>.
thats it it becomes private 

actually this same thing can be done by just checking in useEffect if the person is logged in or not and if not then
reidirect him to login page. But this one makes it easier and is reusable so we dont need to write the same code in
useEffect of each component

tip: just copy paste it in ur projects if u want this kind of functionality, dont waste time understanding it 

more info : https://reactrouter.com/web/example/auth-workflow

*/

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))

  return user && user.token ? (
    <Route {...rest} render={() => children} />
  ) : (
    <LoadingToRedirect />
  )
}

export default UserRoute
