import { useState, useEffect } from 'react'
import { AppBar, Button, Container, Toolbar } from '@mui/material'
import blogService from './services/notes'
import loginService from './services/login'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Home from './components/Home'
import Footer from './components/Footer'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'
import Catchall from './components/Catchall'

import { useBlog, useBlogActions } from './store'
import { useNotificationActions } from './NotificationStore'
import { useUser, useUserActions } from './UserStore'

const App = () => {
  const blogs = useBlog()
  const { add, initialise, like, remove } = useBlogActions()
  const user = useUser()
  const { setUser } = useUserActions()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { addNotif } = useNotificationActions()

  useEffect(() => {
    initialise()
  }, [initialise])

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [setUser])

  const addBlog = async (blogObject) => {
    await add(blogObject)
    addNotif(`blog ${blogObject.title} by ${blogObject.author} added`)
  }

  const deleteBlog = async (blog) => {
    await remove(blog)
    addNotif('blog removed')
  }

  const handleLikes = async (blog) => {
    await like(blog)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      addNotif('successfully logged in, ' + user.name)
      navigate('/blogs')

      // eslint-disable-next-line no-unused-vars
    } catch (exception) {
      addNotif('wrong username or password')
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  // console.log('blog:', blog)

  return (
    <Container>
      <div>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/" sx={style}>
                home
              </Button>

              <Button color="inherit" component={Link} to="/blogs" sx={style}>
                blogs
              </Button>

              {user && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/create"
                  sx={style}
                >
                  new blog
                </Button>
              )}

              {!user && (
                <Button color="inherit" component={Link} to="/login" sx={style}>
                  login
                </Button>
              )}

              {user && (
                <Button
                  color="inherit"
                  sx={style}
                  onClick={() => {
                    setUser(null)
                    blogService.setToken(null)
                    window.localStorage.removeItem('loggedBlogappUser')
                    addNotif('successfully logged out')
                    navigate('/blogs')
                  }}
                >
                  logout
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </div>

        <ErrorBoundary>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={blog}
                  deleteBlog={deleteBlog}
                  handleLikes={handleLikes}
                  user={user}
                />
              }
            />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
            <Route
              path="/login"
              element={
                <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) =>
                    setUsername(target.value)
                  }
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  handleLogin={handleLogin}
                />
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Catchall />} />
          </Routes>
        </ErrorBoundary>

        <Footer />
      </div>
    </Container>
  )
}

export default App
