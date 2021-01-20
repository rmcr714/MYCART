import admin from '../firebase/index.js'

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
