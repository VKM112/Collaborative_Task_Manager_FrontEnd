import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import type { LoginInput } from '../features/auth/types'
import { useLogin } from '../features/auth/hooks'

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginInput>()
  const { mutate, isPending } = useLogin()

  const onSubmit = (values: LoginInput) => {
    mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500">Manage your tasks and collaborate with your team.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('email')} label="Email address" type="email" required />
          <Input {...register('password')} label="Password" type="password" required />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
