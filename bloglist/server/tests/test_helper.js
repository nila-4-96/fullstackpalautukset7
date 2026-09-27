const Blog = require('../models/note')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'An indie site',
    author: 'Pim',
    url: 'https://www.google.com',
    likes: 4,
  },
  {
    title: 'Another indie site',
    author: 'Pim',
    url: 'https://www.wikipedia.com',
    likes: 1,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
