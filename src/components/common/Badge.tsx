type BadgeProps = {
  label: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
}

type BadgeVariant = NonNullable<BadgeProps['variant']>

const variantClasses: Record<BadgeVariant, string> = {
  info: 'bg-indigo-50 text-indigo-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
}

const Badge = ({ label, variant = 'info' }: BadgeProps) => {
  const resolvedVariant: BadgeVariant = variant
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[resolvedVariant]}`}>{label}</span>
}

export default Badge
