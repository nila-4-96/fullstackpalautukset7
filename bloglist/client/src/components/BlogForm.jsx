import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    navigate('/blogs')
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <TextField
          label="title"
          value={title.value}
          onChange={title.onChange}
          placeholder="Blog title"
        />
        <TextField
          label="author"
          value={author.value}
          onChange={author.onChange}
          placeholder="Blog author"
        />
        <TextField
          label="url"
          value={url.value}
          onChange={url.onChange}
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
