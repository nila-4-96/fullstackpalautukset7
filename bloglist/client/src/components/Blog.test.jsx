import { render, screen } from '@testing-library/react'
import {
  Routes,
  Route,
  // useParams,
  // useNavigate,
  BrowserRouter as Router,
} from 'react-router-dom'
// import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogList from './BlogList'
import BlogForm from './BlogForm'

test('all details but not buttons are shown (logged out)', async () => {
  const blog = {
    title: 'Rendered title',
    author: 'Pim',
    url: 'gogel.co.ru.xyz',
    user: {
      name: 'Magabur',
      username: 'magabur',
    },
  }

  const { container } = render(
    <Router>
      <Blog blog={blog} />
    </Router>,
  )

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Rendered title')

  expect(div).toHaveTextContent('Pim')

  expect(div).toHaveTextContent('gogel.co.ru.xyz')

  expect(div).toHaveTextContent('likes')

  expect(div).toHaveTextContent('Magabur')

  const likeButton = screen.queryAllByText('like')
  expect(likeButton).toHaveLength(0)

  const removeButton = screen.queryAllByText('remove')
  expect(removeButton).toHaveLength(0)
})

test('all details + like button are shown (logged in, another user)', async () => {
  const blog = {
    title: 'Rendered title',
    author: 'Pim',
    url: 'gogel.co.ru.xyz',
    user: {
      name: 'Magabur',
      username: 'magabur',
    },
  }

  const secUser = {
    name: 'Bungley',
    username: 'spungley',
  }

  const { container } = render(
    <Router>
      <Blog blog={blog} user={secUser} />
    </Router>,
  )

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Rendered title')

  expect(div).toHaveTextContent('Pim')

  expect(div).toHaveTextContent('gogel.co.ru.xyz')

  expect(div).toHaveTextContent('likes')

  expect(div).toHaveTextContent('Magabur')

  const likeButton = screen.queryAllByText('like')
  expect(likeButton).toHaveLength(1)

  const removeButton = screen.queryAllByText('remove')
  expect(removeButton).toHaveLength(0)
})

test('all details + like and remove buttons are shown (logged in, blog poster)', async () => {
  const blog = {
    title: 'Rendered title',
    author: 'Pim',
    url: 'gogel.co.ru.xyz',
    user: {
      name: 'Magabur',
      username: 'magabur',
    },
  }

  const { container } = render(
    <Router>
      <Blog blog={blog} user={blog.user} />
    </Router>,
  )

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Rendered title')

  expect(div).toHaveTextContent('Pim')

  expect(div).toHaveTextContent('gogel.co.ru.xyz')

  expect(div).toHaveTextContent('likes')

  expect(div).toHaveTextContent('Magabur')

  const likeButton = screen.queryAllByText('like')
  expect(likeButton).toHaveLength(1)

  const removeButton = screen.queryAllByText('remove')
  expect(removeButton).toHaveLength(1)
})

/*
test('url, likes and user are shown when the view button is clicked', async () => {

  const blog = {
    title: 'Rendered title',
    author: 'Pim',
    url: 'gogel.co.ru.xyz',
    likes: 5,
    id: '123',
    user: {
      name: 'Magabur',
      username: 'magabur'
    }
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog blog={blog} user={mockHandler} />)

  const div = container.querySelector('.blog')

  const userTest = userEvent.setup()
  const button = screen.getByText('view')
  await userTest.click(button)

  expect(div).toHaveTextContent(
    'gogel.co.ru.xyz'
  )

  expect(div).toHaveTextContent(
    'likes 5'
  )

  expect(div).toHaveTextContent(
    'Magabur'
  )
})

test('like button can be clicked twice', async () => {

  const blog = {
    title: 'Rendered title',
    author: 'Pim',
    url: 'gogel.co.ru.xyz',
    likes: 5,
    id: '123',
    user: {
      name: 'Magabur',
      username: 'magabur'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={blog.user} handleLikes={mockHandler} />)

  const userTest = userEvent.setup()
  const button = screen.getByText('view')
  await userTest.click(button)

  const likeButton = screen.getByText('like')
  await userTest.click(likeButton)
  await userTest.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
*/
