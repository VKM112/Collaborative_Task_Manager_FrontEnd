import { forwardRef } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, className = '', ...props }, ref) => {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      {label && <span className="font-semibold text-slate-800">{label}</span>}
      <input
        ref={ref}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  )
})

Input.displayName = 'Input'

export default Input
