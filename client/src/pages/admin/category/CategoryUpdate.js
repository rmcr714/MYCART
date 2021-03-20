import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

import { getCategory, updateCategory } from '../../../functions/category'

const CategoryUpdate = ({ history, match }) => {
  //States
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => ({ ...state }))

  //Use effect
  useEffect(() => {
    loadCategory()
  }, [])

  //Load all the categories on component mount
  const loadCategory = () => {
    getCategory(match.params.slug).then((res) => {
      setName(res.data.name)
    })
  }

  //Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    updateCategory(user.token, name, match.params.slug)
      .then((res) => {
        setLoading(false)
        setName('')
        toast.success(`${res.data.name} is updated successfully`)
        history.push('/admin/category') // redirect back to the category page after upating
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
          minLength='4'
        />
        <br />
        <button className='btn btn-outline-primary' disabled={name == ''}>
          Save
        </button>
      </div>
    </form>
  )

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? (
            <h4 className='text-danger'>loading...</h4>
          ) : (
            <h4>Update Category</h4>
          )}
          {categoryForm()}

          <hr />
        </div>
      </div>
    </div>
  )
}

export default CategoryUpdate
