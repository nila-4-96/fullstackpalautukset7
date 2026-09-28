import { useEffect } from 'react'
import { AppBar, Button, Container, Toolbar } from '@mui/material'
import blogService from './services/notes'
import loginService from './services/login'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import Home from './components/Home'
import Footer from './components/Footer'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'
import Catchall from './components/Catchall'
import User from './components/User'
import persistentUser from './services/persistentUser'

import { useBlog, useBlogActions } from './store'
import { useNotificationActions } from './NotificationStore'
import { useUser, useUsers, useUserActions } from './UserStore'

const App = () => {
  const blogs = useBlog()
  const { add, initialise, like, remove } = useBlogActions()
  const user = useUser()
  const { setUser, initialiseUsers } = useUserActions()
  const users = useUsers()
  const { addNotif } = useNotificationActions()

  useEffect(() => {
    initialise()
  }, [initialise])

  useEffect(() => {
    initialiseUsers()
  }, [initialiseUsers])

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const navigate = useNavigate()

  useEffect(() => {
    const user = persistentUser.getUser()

    if (user) {
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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      persistentUser.saveUser(user)

      blogService.setToken(user.token)
      setUser(user)

      addNotif('successfully logged in, ' + user.name)
      navigate('/blogs')

      // eslint-disable-next-line no-unused-vars
    } catch (exception) {
      addNotif('wrong username or password')
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null
  const userMatch = useMatch('/users/:id')
  const userSelected = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  return (
    <Container>
      <div>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/" sx={style}>
                home
              </Button>

              <Button color="inherit" component={Link} to="/users" sx={style}>
                users
              </Button>

              <Button color="inherit" component={Link} to="/" sx={style}>
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
                    persistentUser.removeUser()
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

            <Route path="/users/:id" element={<User user={userSelected} />} />

            <Route path="/users" element={<UserList />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
            <Route
              path="/login"
              element={
                <LoginForm handleLogin={handleLogin} />
              }
            />
            <Route path="/" element={<BlogList />} />
            <Route path="*" element={<Catchall />} />
          </Routes>
        </ErrorBoundary>

        <Footer />
      </div>
    </Container>
  )
}

export default App
