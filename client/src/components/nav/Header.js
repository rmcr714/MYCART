import React, { useState } from 'react'
import { Menu } from 'antd'
import Search from '../forms/Search'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppstoreFilled,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
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
      className='fixed-top'
      onClick={handleClick}
      selectedKeys={[current]}
      mode='horizontal'
      style={{ backgroundColor: '#4f86f7' }} //'#DEE1E6' original color
    >
      <Item key='home' icon={<AppstoreFilled style={{ color: 'white' }} />}>
        <Link to='/' style={{ color: 'white' }}>
          Home
        </Link>
      </Item>
      <Item key='shop'>
        <Link to='/shop' style={{ color: 'white' }}>
          <i className='fas fa-shopping-bag'></i> &nbsp;Shop
        </Link>
      </Item>
      {!user && (
        <Item
          key='register'
          icon={<UserAddOutlined style={{ color: 'white' }} />}
          className='float-right'
        >
          <Link to='/register' style={{ color: 'white' }}>
            {' '}
            Register
          </Link>
        </Item>
      )}
      {!user && (
        <Item
          key='login'
          icon={<UserOutlined style={{ color: 'white' }} />}
          className='float-right'
        >
          <Link to='/login' style={{ color: 'white' }}>
            {' '}
            Login
          </Link>
        </Item>
      )}
      {user && (
        <SubMenu
          key='SubMenu'
          icon={<SettingOutlined style={{ color: 'white' }} />}
          title={user.email && user.email.split('@')[0]}
          className='float-right'
          style={{ color: 'white' }}
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
      <span className='float-right mr-4 mt-2 mb-2'>
        <Search />
      </span>
    </Menu>
  )
}

export default Header
