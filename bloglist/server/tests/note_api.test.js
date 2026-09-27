const assert = require('node:assert')
const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

let token

before(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send({
    username: 'bungley',
    name: 'Bungley',
    password: 'wrong',
  })
  const response = await api.post('/api/login').send({
    username: 'bungley',
    password: 'wrong',
  })
  token = response.body.token
  console.log('token:', token)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    // console.log('entered test')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    // console.log('Response body:', response.body)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    // console.log('response.body.length:', response.body.length)
    // console.log('helper.initialBlogs.length:', helper.initialBlogs.length)
  })
})

describe('blog addition & editing', () => {
  test('blog can be added using POST', async () => {
    const postBlog = {
      title: 'One more indie site',
      author: 'Pim',
      url: 'https://www.youtube.com',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(postBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    /*
    console.log('blogsAtEnd', blogsAtEnd)
    console.log('blogsAtEnd.length:', blogsAtEnd.length)
    console.log('helper.initialBlogs.length + 1:', helper.initialBlogs.length + 1)
    */

    const contents = blogsAtEnd.map((n) => n.title)
    assert(contents.includes('One more indie site'))
  })

  test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      id: blogToUpdate.id,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

    // console.log('blogInDb:', blogInDb)
    // console.log('updatedBlog:', updatedBlog)

    assert.deepStrictEqual(blogInDb, updatedBlog)
  })
})

describe('blog error handling', () => {
  test('blog id field is called id', async () => {
    const response = await api.get('/api/blogs')

    /*console.log(
      'Object.keys(response.body[0]):',
      Object.keys(response.body[0]),
    )*/

    assert(Object.keys(response.body[0]).includes('id'))
  })

  test('blog with undefined likes gets default value 0', async () => {
    const postBlog = {
      title: 'Yet another indie site',
      author: 'Pim',
      url: 'https://www.merriam-webster.com/',
    }

    await api
      .post('/api/blogs')
      .send(postBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(
      blogsAtEnd.find((blog) => blog.title === 'Yet another indie site').likes,
      0,
    )
  })

  test('blog without a title returns 400', async () => {
    const postBlog = {
      author: 'Pim',
      url: 'https://www.merriam-webster.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(postBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without a url returns 400', async () => {
    const postBlog = {
      title: 'Yet another indie site',
      author: 'Pim',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(postBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without a token does not save', async () => {
    const postBlog = {
      title: 'Yet another indie site',
      author: 'Pim',
      url: 'https://www.merriam-webster.com/',
      likes: 3,
    }

    await api.post('/api/blogs').send(postBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', async () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const deleteBlog = {
      title: 'Chainsaar',
      author: 'Bungley',
      url: 'https://www.chainsaar.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(deleteBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find((blog) => blog.title === 'Chainsaar')

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })
})

describe('creation checks', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('failure if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abarcus',
      name: 'Tobus',
      password: 't',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'Password and username must be at least 3 characters long',
      ),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('failure if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Tobus',
      password: 'tobus',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'Password and username must be at least 3 characters long',
      ),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
