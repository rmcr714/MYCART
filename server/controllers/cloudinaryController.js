import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//@desc   send image from frontend to upload to cloudinary cloud
//@route  POST /api/uploadimages
//@access  Admin
export const upload = async (req, res) => {
  console.log('Reaching upload')
  try {
    let result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto', //jpeg,png
    })
    res.json({ public_id: result.public_id, url: result.secure_url })
  } catch (err) {
    console.log(err)
  }
}

//@desc   delete image from  cloudinary cloud
//@route  POST /api/removeimage
//@access  Admin
export const remove = async (req, res) => {
  let image_id = req.body.public_id
  // console.log(image_id)
  await cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) {
      // console.log('error indeleting', err)
      return res.json({ success: false, err })
    }

    res.send('Image deleted successfully')
  })
}
