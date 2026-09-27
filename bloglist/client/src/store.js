import { create } from 'zustand'
import blogService from './services/notes'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    add: async (content) => {
      const newBlog = await blogService.create(content)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },

    initialise: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },

    like: async (content) => {
      const newBlog = await blogService.update(content.id, {
        ...content,
        likes: content.likes + 1,
      })
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === newBlog.id ? { ...blog, likes: newBlog.likes } : blog,
        ),
      }))
    },

    remove: async (content) => {
      await blogService.rmServBlog(content.id)
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== content.id),
      }))
    },
  },
}))

export const useBlog = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
