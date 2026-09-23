// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks/useAnecdotes'

const CreateNew = () => {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ 
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0 })
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
      </form>
      <button onClick={() => {
        resetContent()
        resetAuthor()
        resetInfo()
      }}>reset</button>
    </div>
  )
}

export default CreateNew
