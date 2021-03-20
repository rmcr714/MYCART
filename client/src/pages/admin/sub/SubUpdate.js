import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

import { getSub, updateSub } from '../../../functions/sub'
import { getCategories } from '../../../functions/category'

const SubUpdate = ({ match, history }) => {
  //States
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [parent, setParent] = useState('')
  const { user } = useSelector((state) => ({ ...state }))

  //Use effect to load all the categories in the categories collection and display them in a list
  useEffect(() => {
    loadCategories()
    loadSub()
  }, [])

  //Load all the categories on component mount
  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data)
    })
  }

  //Load all sub categories on component mount
  const loadSub = () => {
    getSub(match.params.slug).then((res) => {
      setName(res.data.name)
      setParent(res.data.parent)
    })
  }

  //Submit, creating a new category
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    updateSub({ authToken: user.token, name, parent, slug: match.params.slug })
      .then((res) => {
        setLoading(false)
        setName('')
        toast.success(`${res.data.name} is updated successfully`)
        history.push('/admin/sub')
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
          minLength='2'
        />
        <br />
        <button className='btn btn-outline-primary' disabled={name == ''}>
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
            <h4>Update Sub Category</h4>
          )}
          <div className='form-group'>
            <label>Parent Category </label>
            <select
              name='category'
              className='form-control'
              onChange={(e) => setParent(e.target.value)}
              required
            >
              <option value='please select'>Please Select</option>
              {categories.length > 0 &&
                categories.map((data) => (
                  <option
                    value={data._id}
                    key={data._id}
                    selected={data._id === parent}
                  >
                    {data.name}
                  </option>
                ))}
            </select>
          </div>
          {categoryForm()}
          <hr />
        </div>
      </div>
    </div>
  )
}

export default SubUpdate
