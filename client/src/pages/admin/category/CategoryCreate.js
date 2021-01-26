import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  getCategories,
  getcategory,
  removeCategory,
  updateCategory,
  createCategory,
} from '../../../functions/category'

const CategoryCreate = () => {
  //States
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const { user } = useSelector((state) => ({ ...state }))

  //Use effect
  useEffect(() => {
    loadCategories()
  }, [name])

  //Load all the categories on component mount
  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data)
    })
  }

  //Deleting a categoty
  const handleRemove = async (slug) => {
    if (window.confirm(`Do u really want to delete category ${slug}`)) {
      setLoading(true)
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false)
          toast.success(`${res.data.name} Deleted successfully`)
          loadCategories() //to fetch all the categories again once the categories are deleted
        })
        .catch((err) => {
          setLoading(false)
          if (err.response.status === 400) {
            toast.error(err.response.data)
          }
        })
    }
  }

  //Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    createCategory(name, user.token)
      .then((res) => {
        setLoading(false)
        setName('')
        toast.success(`${res.data.name} is created successfully`)
        loadCategories()
        // to fetch the newly created categories when any new category is added (useeffect infinite loop alternative)
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.response.data)
      })
  }

  //Category form
  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label>Name</label>
        <input
          type='text'
          className='form-control'
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <br />
        <button className='btn btn-outline-primary' disabled={name.length < 2}>
          Save
        </button>
      </div>
    </form>
  )

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? (
            <h4 className='text-danger'>loading...</h4>
          ) : (
            <h4>Create Category</h4>
          )}
          {categoryForm()}

          <hr />
          {categories.map((c) => (
            <div key={c._id} className='alert alert-dark'>
              {c.name}{' '}
              <span
                className='btn btn-sm float-right'
                onClick={() => handleRemove(c.slug)}
              >
                <DeleteOutlined
                  className='text-danger'
                  style={{ fontSize: '17px' }}
                />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
                <span className='btn btn-sm float-right'>
                  <EditOutlined
                    className='text-success'
                    style={{ fontSize: '17px', marginRight: '30px' }}
                  />
                </span>
                {'     '}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryCreate
