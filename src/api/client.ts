import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           'https://collaborative-task-manager-backend-80yy.onrender.com/api/v1',
  withCredentials: true,
});
