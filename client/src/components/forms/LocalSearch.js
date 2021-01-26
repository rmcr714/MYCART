import React from 'react'

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault()
    setKeyword(e.target.value.toLowerCase())
  }
  return (
    <div className='container p-5'>
      <input
        type='search'
        placeholder='Filter'
        value={keyword}
        onChange={handleSearchChange}
        className='form-control mb-4'
      />
    </div>
  )
}

export default LocalSearch
