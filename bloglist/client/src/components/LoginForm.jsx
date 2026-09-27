import Notification from './Notification'
import { useNotification } from '../NotificationStore'
import { Button, TextField } from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  const notification = useNotification()
  return (
    <div>
      <Notification message={notification} />
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <TextField
          label="username"
          value={username}
          type="text"
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <TextField
          label="password"
          value={password}
          type="password"
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
