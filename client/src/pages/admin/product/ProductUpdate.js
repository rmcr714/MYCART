import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'
import { ConsoleSqlOutlined } from '@ant-design/icons'

const { Option } = Select

const productState = {
  title: '',
  description: '',
  price: '',
  category: '',
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'brown', 'silver', 'white', 'blue'], //options to show in dropdown so that admin can pick one
  brands: ['Samsung', 'Microsoft', 'Apple', 'Lenovo', 'ASUS', 'DELL'], //options to show in dropdown so that admin can pick one
  color: '',
  brand: '',
}

const ProductUpdate = ({ match }) => {
  //redux logged in user
  const { user } = useSelector((state) => ({ ...state }))
  const { slug } = match.params
  const [values, setValues] = useState(productState)
  //Storing the subcategories
  const [subOptions, setSubOptions] = useState([])
  const [categories, setCategories] = useState([])

  const {
    title,
    description,
    price,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values

  useEffect(() => {
    loadProduct()
    loadCategories()
  }, [])

  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data)
    })
  }

  const loadProduct = () => {
    getProduct(slug)
      .then((res) => {
        console.log('single', res)
        setValues({ ...values, ...res.data })
        console.log('The state values are ', values)
      })
      .catch((err) => {})
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  //when admin selects a category a api request is made to backend to fetch all the sub-categories for that category
  const handleCategoryChange = (e) => {
    e.preventDefault()
    // console.log('Clciked Category', e.target.value)
    setValues({ ...values, subs: [], [e.target.name]: e.target.value })
    getCategorySubs(e.target.value)
      .then((res) => {
        console.log('the data', res.data)
        setSubOptions(res.data)
      })
      .catch((err) => {})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4>Product Update</h4>
          {JSON.stringify(values)}
          <hr />

          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Title</label>
              <input
                type='text'
                name='title'
                className='form-control'
                value={title}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                className='form-control'
                value={description}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Price</label>
              <input
                type='Number'
                name='price'
                className='form-control'
                value={price}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Shipping</label>
              <select
                name='shipping'
                className='form-control'
                value={shipping === 'Yes' ? 'Yes' : 'No'}
                onChange={handleChange}
              >
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Quantity</label>
              <input
                type='Number'
                name='quantity'
                className='form-control'
                value={quantity}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Colors</label>
              <select
                name='color'
                className='form-control'
                value={color}
                onChange={handleChange}
              >
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Brand</label>
              <select
                name='brand'
                className='form-control'
                onChange={handleChange}
                value={brand}
              >
                {brands.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Category </label>
              <select
                name='category'
                className='form-control'
                onChange={handleCategoryChange}
                required
              >
                {categories.length > 0 &&
                  categories.map((data) => (
                    <option
                      value={data._id}
                      key={data._id}
                      defaultValue={category.name == data.name}
                    >
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>

            <br />
            <button type='submit' className='btn btn-outline-info'>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
