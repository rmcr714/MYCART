import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { getSubs } from '../../functions/sub'
import { toast } from 'react-toastify'

const SubList = () => {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSubs()
      .then((res) => {
        setSubs(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        if (err.response.status === 400) {
          toast.error(err.response.data)
        }
      })
  }, [])

  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        className='col btn btn-outlined-primary btn-md btn-block btn-raised m-1'
      >
        <Link to={`/sub/${s.slug}`}>{s.name}</Link>
      </div>
    ))

  return (
    <div className='container-fluid'>
      {/* <h5 className='p-2 mt-2 mb-4 ml-2 display-4 text-dark text-center alert-dark'>
        Categories
      </h5> */}
      <br />
      <div className='row'>
        {loading || subs.length === 0 ? (
          <LoadingOutlined className='h1 text-primary ' />
        ) : (
          showSubs()
        )}
      </div>
    </div>
  )
}

export default SubList
