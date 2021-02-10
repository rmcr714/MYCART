import React, { useState } from 'react'
import { Menu } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppstoreFilled,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom' //we cant use history here as this components doesnt have a path/route in App.js

const { SubMenu, Item } = Menu

const Header = () => {
  const [current, setCurrent] = useState('home')

  const dispatch = useDispatch()
  const { user } = useSelector((state) => ({ ...state }))

  const history = useHistory()

  const handleClick = (e) => {
    // console.log(e)

    setCurrent(e.key)
  }

  const logout = () => {
    firebase.auth().signOut()
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    history.push('/login')
  }

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode='horizontal'
      style={{ backgroundColor: '#ffff' }} //'#DEE1E6' original color
    >
      <Item key='home' icon={<AppstoreFilled />}>
        <Link to='/'>Home</Link>
      </Item>
      {!user && (
        <Item key='register' icon={<UserAddOutlined />} className='float-right'>
          <Link to='/register'> Register</Link>
        </Item>
      )}
      {!user && (
        <Item key='login' icon={<UserOutlined />} className='float-right'>
          <Link to='/login'> Login</Link>
        </Item>
      )}
      {user && (
        <SubMenu
          key='SubMenu'
          icon={<SettingOutlined />}
          title={user.email && user.email.split('@')[0]}
          className='float-right'
        >
          {user && user.role === 'subscriber' && (
            <Item>
              <Link to='/user/history'>Dashboard</Link>
            </Item>
          )}
          {user && user.role === 'admin' && (
            <Item>
              <Link to='/admin/dashboard'>Admin Dashboard</Link>
            </Item>
          )}
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  )
}

export default Header
