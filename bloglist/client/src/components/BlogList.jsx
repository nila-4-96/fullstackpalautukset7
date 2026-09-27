import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Link } from 'react-router-dom'
import Notification from './Notification'
import { useNotification } from '../NotificationStore'
import { useBlog } from '../store'

const BlogList = () => {
  const notification = useNotification()
  const blogs = useBlog()

  // throw new Error('simulated error')

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs
              .sort(function (a, b) {
                return b.likes - a.likes
              })
              .map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
