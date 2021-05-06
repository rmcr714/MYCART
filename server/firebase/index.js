import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

import serviceAccount from '../privatekey/fbServiceAccountKey.js'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
