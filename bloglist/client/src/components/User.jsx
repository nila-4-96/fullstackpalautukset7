import { Typography, CardContent } from '@mui/material'
import Catchall from './Catchall'

const User = ({ user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!user) {
    return <Catchall />
  }

  return (
    <div className="user">
      <div style={blogStyle}>
        <CardContent>
          <Typography variant="h5" component="div">
            {user.name}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
            "{user.username}"
          </Typography>

          <Typography variant="h6">added blogs:</Typography>

          <ul>
            {user.blogs.map((blog) => {
              return <li key={blog.id}>{blog.title}</li>
            })}
          </ul>
        </CardContent>
      </div>
    </div>
  )
}

export default User
