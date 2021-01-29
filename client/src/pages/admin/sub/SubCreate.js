import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getSubs, removeSub, createSub } from '../../../functions/sub'
import { getCategories } from '../../../functions/category'

const SubCreate = () => {
  //States
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [subs, setSubs] = useState([])
  const { user } = useSelector((state) => ({ ...state }))

  //search the categories
  //step 1
  const [keyword, setKeyword] = useState('')
  //step 2 add an input field to type the search querys,added below

  //Use effect to load all the categories in the categories collection and display them in a list
  useEffect(() => {
    loadCategories()
    loadSubs()
  }, [])

  //Load all the categories on component mount
  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data)
    })
  }

  //Load all sub categories on component mount
  const loadSubs = () => {
    getSubs().then((res) => {
      setSubs(res.data)
    })
  }

  //Deleting a categoty
  const handleRemove = async (slug) => {
    if (window.confirm(`Do u really want to delete category ${slug}`)) {
      setLoading(true)
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false)
          toast.success(`${res.data.name} Deleted successfully`)
          loadSubs() //to fetch all the sub categories again once the sub categories are deleted
        })
        .catch((err) => {
          setLoading(false)
          if (err.response.status === 400) {
            toast.error(err.response.data)
          }
        })
    }
  }

  //Submit, creating a new category
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false)
        setName('')
        toast.success(`${res.data.name} is created successfully`)
        loadSubs()
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

  //step 3
  //for search
  const handleSearchChange = (e) => {
    e.preventDefault()
    setKeyword(e.target.value.toLowerCase())
  }

  //step 4 , pass the keyword to filter the categories array
  // categories array looks like this [{name:'microsoft,slug:'microsoft'},{name:'Dell,slug:'dell'}] or look in categories collection in db
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

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
            <h4>Create Sub Category</h4>
          )}
          <div className='form-group'>
            <label>Parent Category </label>
            <select
              name='category'
              className='form-control'
              onChange={(e) => setCategory(e.target.value)}
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
          {categoryForm()}
          <hr />
          {/* Step 2 : provide a search bar for users to enter the keyword */}
          <input
            type='search'
            placeholder='Filter'
            value={keyword}
            onChange={handleSearchChange}
            className='form-control mb-4'
          />
          {/* step 5 place the searched function here, here we are basically using the js filter method to filter
          the array data in categories array based on the keyword typed by the user and then mapping over it */}
          {subs.filter(searched(keyword)).map((s) => (
            <div key={s._id} className='alert alert-dark'>
              {s.name}{' '}
              <span
                className='btn btn-sm float-right'
                onClick={() => handleRemove(s.slug)}
              >
                <DeleteOutlined
                  className='text-danger'
                  style={{ fontSize: '17px' }}
                />
              </span>
              <Link to={`/admin/sub/${s.slug}`}>
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

export default SubCreate
