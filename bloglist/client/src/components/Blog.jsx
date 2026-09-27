import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
} from '@mui/material'
import Catchall from './Catchall'

const Blog = ({ blog, user, deleteBlog, handleLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const id = useParams().id
  const navigate = useNavigate()

  if (!blog) {
    return <Catchall />
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(id)
      navigate('/blogs')
    }
  }

  // {console.log('blog.user.username:', blog.user.username)}
  // {console.log('logged user:', JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username)}

  return (
    <div className="blog">
      <div style={blogStyle}>
        <CardContent>
          <Typography variant="h5" component="div">
            {blog.title}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
            {blog.author}
          </Typography>

          <Typography variant="body2">
            <Link to={blog.url}>{blog.url}</Link>
          </Typography>

          <Typography variant="body2">user: {blog.user.name}</Typography>

          <Typography variant="body2">likes: {blog.likes}</Typography>
        </CardContent>

        <CardActions>
          {blog.user && user && (
            <Button
              color="success"
              variant="contained"
              onClick={() => handleLikes(blog)}
            >
              like
            </Button>
          )}
        </CardActions>

        <CardActions>
          {blog.user && user && blog.user.username === user.username && (
            <Button color="error" variant="contained" onClick={handleDelete}>
              remove
            </Button>
          )}
        </CardActions>
      </div>
    </div>
  )
}

export default Blog
