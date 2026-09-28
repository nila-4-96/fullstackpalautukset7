import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Notification from './Notification'
import { useNotification } from '../NotificationStore'
import { useUsers, useUserActions } from '../UserStore'

const UserList = () => {
  const notification = useNotification()
  const users = useUsers()
  const { initialiseUsers } = useUserActions()

  useEffect(() => {
    initialiseUsers()
  }, [initialiseUsers])

  return (
    <div>
      <h1>Users</h1>
      <Notification message={notification} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
