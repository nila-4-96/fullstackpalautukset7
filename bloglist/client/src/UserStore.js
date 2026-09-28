import { create } from 'zustand'
import userService from './services/users'

const useUserStore = create((set) => ({
  user: null,
  users: [],
  actions: {
    setUser: (user) => set({ user }),

    initialiseUsers: async () => {
      const users = await userService.getAll()
      set(() => ({ users }))
    },
  },
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUsers = () => useUserStore((state) => state.users)
export const useUserActions = () => useUserStore((state) => state.actions)
