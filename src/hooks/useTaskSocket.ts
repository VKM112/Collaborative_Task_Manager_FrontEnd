import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import type { Task } from '../features/tasks/types';

export function useTaskSocket(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

    const socket = io(baseUrl, { withCredentials: true });

    socket.emit('join', userId);

    socket.on('task-updated', (task: Task) => {
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => (t.id === task.id ? task : t))
      );
    });

    socket.on('task-assigned', (task: Task) => {
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => (t.id === task.id ? task : t))
      );
      // TODO: trigger notification UI
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, queryClient]);
}
