import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { createProduct } from '../../../functions/product'
import { getCategories } from '../../../functions/category'

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
  brands: ['Samsung', 'Microsoft', 'Apple', 'Lenovo', 'ASUS'], //options to show in dropdown so that admin can pick one
  color: '',
  brand: '',
}

const ProductCreate = () => {
  //redux logged in user
  const { user } = useSelector((state) => ({ ...state }))

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
                onChange={handleChange}
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
