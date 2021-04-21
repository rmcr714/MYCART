import Coupon from '../models/couponModel.js'

//@desc create a coupon
//@route POST /api/coupon
//@access  Admin
export const create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon

    res.json(await new Coupon({ name, expiry, discount }).save())
  } catch (err) {
    console.log(err)
  }
}

//@desc delete a coupon
//@route DELETE /api/coupon/couponId
//@access  Admin
export const remove = async (req, res) => {
  try {
    res.json(
      await Coupon.findByIdAndDelete({ _id: req.params.couponId }).exec()
    )
  } catch (err) {
    console.log(err)
  }
}

//@desc read  coupons
//@route GET /api/coupons
//@access  Admin
export const read = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec())
  } catch (err) {
    console.log(err)
  }
}
