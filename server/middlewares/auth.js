import admin from '../firebase/index.js'

export const authCheck = (req, res, next) => {
  console.log(req.headers)
  next()
}
