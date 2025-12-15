import { forwardRef } from 'react'

type SelectOption = {
  label: string
  value: string
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  hint?: string
  options: SelectOption[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, options, className = '', ...props }, ref) => {
    return (
      <label className="space-y-1 text-sm text-slate-700">
        {label && <span className="font-semibold text-slate-800">{label}</span>}
        <select
          ref={ref}
          className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </label>
    )
  },
)

Select.displayName = 'Select'

export default Select
