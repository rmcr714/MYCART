import admin from '../firebase/index.js'
import User from '../models/userModel.js'

export const authCheck = async (req, res, next) => {
  // validate the token
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    // console.log(firebaseUser)
    req.user = firebaseUser

    next()
  } catch (error) {
    res.status(401).json({
      err: 'Invalid or expired token',
    })
  }
}

export const adminCheck = async (req, res, next) => {
  const { email } = req.user
  const adminUser = await User.findOne({ email }).exec()
  if (adminUser.role !== 'admin') {
    res.status(403).json({ err: 'Admin resource. Access denied' })
  } else {
    next()
  }
}
