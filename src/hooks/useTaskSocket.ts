import { useEffect } from 'react'
import { io } from 'socket.io-client'
import type { Task } from '../features/tasks/types'

export const useTaskSocket = (onTaskUpdate: (task: Task) => void) => {
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL ?? ''
    const socket = io(baseUrl, { transports: ['websocket'] })

    socket.on('task:updated', onTaskUpdate)
    socket.on('connect_error', (error) => {
      console.error('Task socket error', error)
    })

    return () => {
      socket.off('task:updated', onTaskUpdate)
      socket.disconnect()
    }
  }, [onTaskUpdate])
}
