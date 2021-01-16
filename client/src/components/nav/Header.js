import React, { useState } from 'react'
import { Menu } from 'antd'
import {
  AppstoreFilled,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { SubMenu, Item } = Menu

const Header = () => {
  const [current, setCurrent] = useState('home')

  const handleClick = (e) => {
    // console.log(e)

    setCurrent(e.key)
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
      <Item key='register' icon={<UserAddOutlined />} className='float-right'>
        <Link to='/register'> Register</Link>
      </Item>
      <Item key='login' icon={<UserOutlined />} className='float-right'>
        <Link to='/login'> Login</Link>
      </Item>

      <SubMenu key='SubMenu' icon={<SettingOutlined />} title='Username'>
        <Item key='setting:1'>Option 1</Item>
        <Item key='setting:2'>Option 2</Item>
      </SubMenu>
    </Menu>
  )
}

export default Header
