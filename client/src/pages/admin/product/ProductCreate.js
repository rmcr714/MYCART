import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { createProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'

const { Option } = Select
const productState = {
  title: '',
  description: '',
  price: '',
  categories: [],
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

const ProductCreate = () => {
  //redux logged in user
  const { user } = useSelector((state) => ({ ...state }))

  //Storing the subcategories
  const [subOptions, setSubOptions] = useState([])

  const [loading, setLoading] = useState(false)

  //get all the categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    getCategories().then((res) => {
      setValues({ ...values, categories: res.data })
    })
  }

  const [values, setValues] = useState(productState)

  const {
    title,
    description,
    price,
    categories,
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

  //Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    createProduct(values, user.token)
      .then((res) => {
        window.alert(`${res.data.title} is created successfully`)
        window.location.reload()
      })
      .catch((err) => {
        toast.error(err.response.data.err)
      })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4>Product create</h4>
          <hr />
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
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
                onChange={handleChange}
              >
                <option value='choose please'>Choose one</option>
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
                onChange={handleChange}
              >
                <option value='choose please'>Choose one</option>
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
              >
                <option value='choose please'>Choose one</option>
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
                <option>Please select category</option>
                {categories.length > 0 &&
                  categories.map((data) => (
                    <option value={data._id} key={data._id}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>
            {/* Multiple subcategories select element */}

            {subOptions.length > 0 && (
              <div>
                <label>Sub Categories </label>
                <Select
                  mode='multiple'
                  style={{ width: '100%' }}
                  placeholder='Please select the subcategories'
                  name='subs'
                  value={subs}
                  onChange={(value) => setValues({ ...values, subs: value })}
                >
                  {subOptions.length > 0 &&
                    subOptions.map((s) => (
                      <Option key={s._id} value={s._id}>
                        {s.name}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
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

export default ProductCreate
