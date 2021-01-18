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
      style={{ backgroundColor: '#DEE1E6' }}
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
          <Item key='setting:1'>Option 1</Item>
          <Item key='setting:2'>Option 2</Item>
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  )
}

export default Header
