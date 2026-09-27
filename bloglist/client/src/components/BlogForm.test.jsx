import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('props are called upon new blog creation', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Blog title')
  const authorInput = screen.getByPlaceholderText('Blog author')
  const urlInput = screen.getByPlaceholderText('Blog url')
  const sendButton = screen.getByText('save')

  await user.type(titleInput, 'Bomb blog')
  await user.type(authorInput, 'Grand Wizard Pim')
  await user.type(urlInput, 'www.bombblog.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Bomb blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Grand Wizard Pim')
  expect(createBlog.mock.calls[0][0].url).toBe('www.bombblog.com')
})
