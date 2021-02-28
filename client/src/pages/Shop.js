import React, { useEffect, useState } from 'react'
import { getProductsByCount, fetchProductsByFilter } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../components/cards/ProductCard'
import { LoadingOutlined } from '@ant-design/icons'
import { DollarOutlined } from '@ant-design/icons'
import { Menu, Slider } from 'antd'
const { SubMenu, ItemGroup } = Menu

const Shop = () => {
  const [products, setProducts] = useState([])
  const [tempProducts, setTempProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState([0, 5000])
  const [ok, setOk] = useState(false)

  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  //used for back button
  // const backReload = () => {
  //   loadAllProducts()
  // }

  //1.load default products when no search is done
  useEffect(() => {
    loadAllProducts()
  }, [])

  //2. load products on user search input( on text change)
  useEffect(() => {
    if (text === '') {
      loadAllProducts()
    }
    const delayed = setTimeout(() => {
      fetchProducts({ query: text })
    }, 1000)
    return () => clearTimeout(delayed)
  }, [text])

  //fetching products based on search criteria
  const fetchProducts = (arg) => {
    setLoading(true)
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data)
      setTempProducts(res.data)
    })
    setLoading(false)
  }

  //3.filter products based on price
  useEffect(() => {
    if (text !== '' && tempProducts.length > 0) {
      const tempData = tempProducts.filter(
        (data) => data.price >= price[0] && data.price <= price[1]
      )
      setProducts(tempData)
    } else if (text == '') {
      fetchProducts({ price })
    }
  }, [ok])

  const handleSlider = (value) => {
    setPrice(value)
    setTimeout(() => {
      setOk(!ok)
    }, 2000)
  }
  //--------------till here price filter-------------------//

  //to load all products (12) when just user just clicks on shop icon without any search
  const loadAllProducts = () => {
    setLoading(true)
    getProductsByCount(12).then((p) => setProducts(p.data))
    setLoading(false)
  }

  return (
    <>
      <Link to='/' className='button'>
        {' '}
        <button type='button' className='btn btn-dark mt-5 ml-2'>
          Go back
        </button>
      </Link>

      <div className='container-fluid mt-2'>
        <br />
        <div className='row'>
          <div className='col-md-3'>
            <h4>Search/filter options</h4>
            <hr />
            <Menu defaultOpenKeys={['1', '2']} mode='inline'>
              <SubMenu
                key='1'
                title={
                  <span className='h6'>
                    <DollarOutlined />
                    Price
                  </span>
                }
              >
                <div>
                  <Slider
                    className='ml-4 mr-4'
                    tipFormatter={(v) => `$${v}`}
                    range
                    value={price}
                    onChange={handleSlider}
                    max='5000'
                  />
                </div>
              </SubMenu>
            </Menu>
          </div>

          <div className='col-md-9'>
            {loading ? (
              <LoadingOutlined className='h1 text-primary' />
            ) : (
              <h3> Products </h3>
            )}
            {products.length < 1 && <p>No products found</p>}
            <div className='row'>
              {products.map((p) => (
                <div className='col-md-4 mb-4' key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop
