import goog from 'googleapis'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const { google } = goog

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
})

export default oAuth2Client
