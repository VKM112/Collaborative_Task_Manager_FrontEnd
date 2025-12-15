import { forwardRef } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
}

type ButtonVariant = NonNullable<ButtonProps['variant']>

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
  outline: 'border border-slate-300 text-slate-900 hover:bg-slate-50',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    const resolvedVariant = variant ?? 'primary'
    const variantClass = variantStyles[resolvedVariant]
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${variantClass} ${className}`}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export default Button
