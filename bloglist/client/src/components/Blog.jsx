import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Typography, CardActions, CardContent, TextField } from '@mui/material'
import Catchall from './Catchall'
import { useBlogActions } from '../store'
import { useState } from 'react'

const Blog = ({ blog, user, deleteBlog, handleLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [commText, setCommText] = useState('')
  const { comment } = useBlogActions()

  const id = useParams().id
  const navigate = useNavigate()

  if (!blog) {
    return <Catchall />
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
      navigate('/blogs')
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    if (commText !== '') {
      await comment(blog.id, commText)
    }
    setCommText('')
  }

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

          <Typography variant="body2">comments:</Typography>
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
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
          {user && (
            <div>
              <form onSubmit={(event) => addComment(event)}>
                <TextField
                  label="comment"
                  value={commText}
                  onChange={(event) => setCommText(event.target.value)}
                />
                <br />
                <br />
                <Button type="submit" color="primary" variant="contained">
                  add comment
                </Button>
              </form>
            </div>
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
