import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryProvider } from './providers/QueryProvider';
import './styles/globals.css';

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
