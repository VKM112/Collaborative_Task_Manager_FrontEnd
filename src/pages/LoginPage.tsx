import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { useLogin, useGoogleLogin } from '../features/auth/hooks'

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useGoogleLogin()
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    mutate({ email, password }, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500">Enter your details to continue organizing work.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
            {error && <p className="text-xs text-rose-600">{error.message || 'Login failed'}</p>}
          </form>
          <div className="space-y-4 rounded border-t border-slate-200 pt-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span className="flex-1 border-t border-slate-200" />
              <span>or</span>
              <span className="flex-1 border-t border-slate-200" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(response) => {
                  if (response.credential)
                    loginWithGoogle(response.credential, {
                      onSuccess: () => navigate('/dashboard'),
                    })
                }}
                onError={() => console.error('Google login failed')}
              />
            </div>
            {isGooglePending && (
              <p className="text-center text-sm text-slate-500">Signing in with Google...</p>
            )}
          </div>
          <p className="text-center text-sm text-slate-500">
            New to Task Flow?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
