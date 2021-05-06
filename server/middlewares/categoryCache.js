import redis from 'redis'

//redis connection and error handler
const redisClient = redis.createClient({
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 3) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

redisClient.on('error', (err) => {
  console.log('redis disconnected')
})

export const listAllCategoryCache = async (req, res, next) => {
  try {
    console.log('redis client', redisClient.connected)
    if (redisClient.connected) {
      redisClient.get('categories', (err, categories) => {
        if (err) {
          next()
        }

        if (categories) {
          console.log(
            'User successfully retrieved from Redis for listing all categories'
          )

          res.json(JSON.parse(categories))
        } else {
          next()
        }
      })
    } else {
      next()
    }
  } catch (err) {
    next()
  }
}

export const categoryProductCache = async (req, res, next) => {
  try {
    console.log('redis client', redisClient.connected)
    if (redisClient.connected) {
      redisClient.get(req.params.slug, (err, categories) => {
        if (err) {
          next()
        }

        if (categories) {
          console.log(
            'User successfully retrieved from Redis for products in categories'
          )

          res.json(JSON.parse(categories))
        } else {
          next()
        }
      })
    } else {
      next()
    }
  } catch (err) {
    next()
  }
}
