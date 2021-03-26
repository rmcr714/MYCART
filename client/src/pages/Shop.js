import React, { useEffect, useState } from 'react'
import { getProductsByCount, fetchProductsByFilter } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Star from '../components/forms/Star'
import { getCategories } from '../functions/category'
import ProductCard from '../components/cards/ProductCard'
import { LoadingOutlined } from '@ant-design/icons'
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { Menu, Slider, Radio } from 'antd'

const { SubMenu, ItemGroup } = Menu

const Shop = () => {
  const [products, setProducts] = useState([])
  const [tempProducts, setTempProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState([0, 5000])
  const [ok, setOk] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('6030cbff2d203528c8da261c')
  const [star, setStar] = useState('')
  const [brands, setBrands] = useState([
    'Samsung',
    'Microsoft',
    'Apple',
    'Lenovo',
    'ASUS',
    'DELL',
    'HP',
    'REALME',
  ])
  const [brand, setBrand] = useState('')

  const { search } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const { text } = search

  //used for back button
  // const backReload = () => {
  //   loadAllProducts()
  // }

  //1.load default products when no search is done
  useEffect(() => {
    loadAllProducts()
    //fetch categories
    getCategories().then((res) => {
      setCategories(res.data)
    })
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
      console.log(res.data)
      setProducts(res.data)
      setTempProducts(res.data)
    })
    setLoading(false)
  }

  //3.filter products based on price
  useEffect(() => {
    if (text !== '' && tempProducts.length > 0) {
      console.log('inside price useEffect', categoryId)
      console.log(brand)

      if (brand == '') {
        const tempData = tempProducts.filter(
          (data) =>
            data.price >= price[0] &&
            data.price <= price[1] &&
            data.category._id == categoryId
        )
        setProducts(tempData)
      } else if (brand !== '') {
        const tempData = tempProducts.filter(
          (data) =>
            data.price >= price[0] &&
            data.price <= price[1] &&
            data.category._id == categoryId &&
            data.brand == brand
        )
        setProducts(tempData)
      }
    } else if (text == '') {
      fetchProducts({ price, category: categoryId, stars: star, brand: brand })
    }
  }, [ok])

  const handleSlider = (value) => {
    setPrice(value)
    setTimeout(() => {
      setOk(!ok)
    }, 2000)
  }
  //--------------till here price filter-------------------//

  //4. Load products based on categories
  //show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Radio
          onChange={handleCheck}
          className='pb-2 pl-4 pr-4'
          value={c._id}
          name='category'
        >
          {c.name}
        </Radio>
        <br />
      </div>
    ))

  //handle category select
  const handleCheck = (e) => {
    console.log(e.target.value)
    // let inTheState = [...categoryIds]
    // let justChecked = e.target.value
    // let alreadyThereInState = inTheState.indexOf(justChecked)
    // if (alreadyThereInState == -1) {
    //   inTheState.push(justChecked)
    // } else {
    //   //if found then pop it out
    //   inTheState.splice(alreadyThereInState, 1)
    // }

    if (text !== '' && star == '') {
      // dispatch({ type: 'SEARCH_QUERY', payload: { text: ''} })
      setCategoryId(e.target.value)
      if (brand == '') {
        const tempData = tempProducts.filter(
          (data) =>
            data.category._id == e.target.value &&
            data.price >= price[0] &&
            data.price <= price[1]
        )
        console.log(tempData)
        setProducts(tempData)
      } else if (brand !== '') {
        const tempData = tempProducts.filter(
          (data) =>
            data.category._id == e.target.value &&
            data.price >= price[0] &&
            data.price <= price[1] &&
            data.brand == brand
        )
        console.log(tempData)
        setProducts(tempData)
      }
    } else {
      setCategoryId(e.target.value)
      fetchProducts({
        price,
        category: e.target.value,
        stars: star,
        brand: brand,
      })
      console.log(categoryId)
    }
  }

  //to load all products (12) when just user just clicks on shop icon without any search
  const loadAllProducts = () => {
    setLoading(true)
    getProductsByCount(12).then((p) => setProducts(p.data))
    setLoading(false)
  }

  //5 Search by rating
  const handleStarClick = (num) => {
    console.log(num)
    setStar(num)
    fetchProducts({ price, category: categoryId, stars: num, brand: brand })
  }
  const showStars = () => (
    <div className='pr-4 pl-4 pb-2'>
      <Star starClick={handleStarClick} numberOfStars={5} />
    </div>
  )

  //search by brand
  const showBrands = () =>
    brands.map((c) => (
      <div key={c}>
        <Radio
          onChange={handleBrand}
          className='pb-2 pl-4 pr-4'
          value={c}
          name='category'
        >
          {c}
        </Radio>
        <br />
      </div>
    ))

  const handleBrand = (e) => {
    console.log(e.target.value)

    if (text != '') {
      console.log('inside handlebrand by text')
      setBrand(e.target.value)
      const tempData = tempProducts.filter(
        (data) =>
          data.category._id == categoryId &&
          data.price >= price[0] &&
          data.price <= price[1] &&
          data.brand == e.target.value
      )

      setProducts(tempData)
    } else {
      setBrand(e.target.value)
      fetchProducts({
        price,
        category: categoryId,
        stars: star,
        brand: e.target.value,
      })
    }
  }

  return (
    <div>
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
            <Menu defaultOpenKeys={['1', '2', '3', '4']} mode='inline'>
              {/* price */}
              <SubMenu
                key='1'
                title={
                  <span className='h6'>
                    <DollarOutlined />
                    <b> Price</b>
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
              {/* category */}
              <SubMenu
                key='2'
                title={
                  <span className='h6'>
                    <DownSquareOutlined />
                    <b> categories</b>
                  </span>
                }
              >
                <div>
                  <Radio.Group onChange={handleCheck} defaultValue={categoryId}>
                    {showCategories()}
                  </Radio.Group>
                </div>
              </SubMenu>
              <br />

              {/* filter by star */}
              <SubMenu
                key='3'
                title={
                  <span className='h6'>
                    <StarOutlined />
                    <b>Rating</b>
                  </span>
                }
              >
                <div className='mt-10'>{showStars()}</div>

                <button
                  class=' btn-primary h6 ml-4 mt-2'
                  onClick={() => {
                    setStar('')
                  }}
                >
                  reset
                </button>
              </SubMenu>
              <br />

              {/* brands */}
              <SubMenu
                key='4'
                title={
                  <span className='h6'>
                    <DownSquareOutlined />
                    <b>Brands</b>
                  </span>
                }
              >
                <div>
                  <Radio.Group>{showBrands()}</Radio.Group>
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
    </div>
  )
}

export default Shop
