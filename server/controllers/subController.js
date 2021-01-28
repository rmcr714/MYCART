import Sub from '../models/subModel.js'
import slugify from 'slugify'

//@desc create a sub category
//@route POST /api/sub
//@access  Admin
export const create = async (req, res) => {
  console.log('Inside backend sub create')
  try {
    // console.log(req.body)
    const { name, parent } = req.body
    const sub = await new Sub({
      name,
      parent,
      slug: slugify(name),
    }).save()

    res.json(sub)
  } catch (error) {
    console.log(error)
    res.status(400).send('create category failed')
  }
}

//@desc get all sub categories
//@route GET /api/subs
//@access  public
export const list = async (req, res) => {
  try {
    const subs = await Sub.find({}).sort({ createdAt: -1 }).exec()
    res.json(subs)
  } catch (err) {
    res.status(400).send('No category found')
  }
}

//@desc read a sub category
//@route GET /api/sub/:slug
//@access  Admin
export const read = async (req, res) => {
  try {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec()
    res.json(sub)
  } catch (err) {
    res.status(403).send('No Such category found')
  }
}

//@desc update a category
//@route PUT /api/category/:slug
//@access  Admin
export const update = async (req, res) => {
  const { name, parent } = req.body

  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name), parent },
      { new: true } //this new parameter is set so that we get the updated document as response, withhout this we will get the old document before the update
    )
    res.json(updated)
  } catch (err) {
    res.status(403).send('Sub Category update failed')
  }
}

//@desc delete a sub category
//@route DELETE /api/sub/:slug
//@access  Admin
export const remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    res.status(403).send('Sub Category delete failed')
  }
}
