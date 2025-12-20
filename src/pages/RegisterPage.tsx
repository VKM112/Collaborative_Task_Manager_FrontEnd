import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import type { RegisterInput } from '../features/auth/types'
import { useRegister, useGoogleLogin } from '../features/auth/hooks'
import { isGoogleLoginEnabled } from '../config/google'

const getRegisterErrorMessage = (error: Error | null | undefined) => {
  if (!error) return undefined

  if (isAxiosError(error)) {
    const dataMessage = error.response?.data?.message
    if (typeof dataMessage === 'string') {
      return dataMessage
    }
    if (error.response?.status === 409) {
      return 'An account with that email already exists.'
    }
  }

  if (error.message.includes('409')) {
    return 'An account with that email already exists.'
  }

  return 'Unable to create account. Please try again.'
}

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterInput>()
  const { mutate, isPending, error } = useRegister()
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useGoogleLogin()
  const navigate = useNavigate()

  const onSubmit = (values: RegisterInput) => {
    mutate(values, { onSuccess: () => navigate('/dashboard', { replace: true }) })
  }

  const errorMessage = getRegisterErrorMessage(error)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
            <p className="text-sm text-slate-500">Start organizing work with your team.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('name')} label="Full name" required />
            <Input {...register('email')} label="Email address" type="email" required />
            <Input {...register('password')} label="Password" type="password" required />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
            {errorMessage && <p className="text-xs text-rose-600">{errorMessage}</p>}
          </form>
          <div className="space-y-4 rounded border-t border-slate-200 pt-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span className="flex-1 border-t border-slate-200" />
              <span>or</span>
              <span className="flex-1 border-t border-slate-200" />
            </div>
            {isGoogleLoginEnabled ? (
              <>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={(response) => {
                      if (response.credential)
                        loginWithGoogle(response.credential, {
                          onSuccess: () => navigate('/dashboard', { replace: true }),
                        })
                    }}
                    onError={() => console.error('Google login failed')}
                  />
                </div>
                {isGooglePending && (
                  <p className="text-center text-sm text-slate-500">Signing in with Google...</p>
                )}
              </>
            ) : (
              <p className="text-center text-sm text-slate-500">
                Google sign-in is temporarily unavailable. Configure `VITE_GOOGLE_CLIENT_ID` to enable
                it.
              </p>
            )}
          </div>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage
