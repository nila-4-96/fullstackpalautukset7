import Notification from './Notification'
import { useNotification } from '../NotificationStore'
import { Button, TextField } from '@mui/material'
import { useField } from '../hooks'

const LoginForm = ({ handleLogin }) => {
  const notification = useNotification()
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(username.value, password.value)
  }

  return (
    <div>
      <Notification message={notification} />
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <TextField
          label="username"
          value={username.value}
          type={username.type}
          onChange={username.onChange}
          placeholder="Username"
        />
        <TextField
          label="password"
          value={password.value}
          type={password.type}
          onChange={password.onChange}
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