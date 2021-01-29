import React from 'react'

const ProductCreateForm = () => {
  return (
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
        <select name='color' className='form-control' onChange={handleChange}>
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
        <select name='brand' className='form-control' onChange={handleChange}>
          <option value='choose please'>Choose one</option>
          {brands.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button type='submit' className='btn btn-outline-info'>
        Save
      </button>
    </form>
  )
}

export default ProductCreateForm
