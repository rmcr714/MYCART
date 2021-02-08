import React from 'react'
import { Card, Skeleton } from 'antd'

const LoadingCard = ({ count }) => {
  const card = () => {
    let totatCards = []
    for (let i = 0; i < count; i++) {
      totatCards.push(
        <Card className='col-md-3 m-3'>
          <Skeleton></Skeleton>
        </Card>
      )
    }

    return totatCards
  }

  return <div className='row p-5'>{card()}</div>
}
export default LoadingCard
