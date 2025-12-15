import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import type { RegisterInput } from '../features/auth/types'
import { useRegister } from '../features/auth/hooks'

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterInput>()
  const { mutate, isPending } = useRegister()

  const onSubmit = (values: RegisterInput) => {
    mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-500">Start organizing work with your team.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('name')} label="Full name" required />
          <Input {...register('email')} label="Email address" type="email" required />
          <Input {...register('password')} label="Password" type="password" required />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
