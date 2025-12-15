import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLogin } from '../features/auth/hooks';

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutate({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <p className="text-red-500 text-sm">Login failed</p>}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white rounded py-2"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
