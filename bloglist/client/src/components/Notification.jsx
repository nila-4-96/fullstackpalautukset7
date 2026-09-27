import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  // return <div className="error">{message}</div>
  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="info">
      {message}
    </Alert>
  )
}

export default Notification
