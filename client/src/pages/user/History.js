import React from 'react'
import UserNav from '../../components/nav/UserNav'

const History = () => {
  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col'>user History page</div>
      </div>
    </div>
  )
}

export default History
