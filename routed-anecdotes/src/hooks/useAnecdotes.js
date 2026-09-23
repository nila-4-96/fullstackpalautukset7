import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => setAnecdotes(anecdotes))
  }, [])

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(newAnecdote => {
      setAnecdotes(anecdotes.concat(newAnecdote))
    })
  }

  const deleteAnecdote = (id) => {
    anecdoteService.remove(id).then(() => {
      setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== id))
    })
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}