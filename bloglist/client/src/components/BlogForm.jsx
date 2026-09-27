import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    navigate('/blogs')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <TextField
          label="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Blog title"
        />
        <TextField
          label="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Blog author"
        />
        <TextField
          label="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Blog url"
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          save
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
