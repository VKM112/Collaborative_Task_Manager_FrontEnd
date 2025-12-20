type ColorStyles = {
  bg: string
  text: string
  ring: string
  dot: string
}

const palette: ColorStyles[] = [
  { bg: 'bg-rose-100', text: 'text-rose-700', ring: 'ring-rose-200', dot: 'bg-rose-500' },
  { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200', dot: 'bg-amber-500' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200', dot: 'bg-emerald-500' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', ring: 'ring-cyan-200', dot: 'bg-cyan-500' },
  { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200', dot: 'bg-blue-500' },
  { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200', dot: 'bg-violet-500' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200', dot: 'bg-fuchsia-500' },
  { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200', dot: 'bg-slate-500' },
]

const hashString = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export const getColorStyles = (seed?: string) => {
  if (!seed) return palette[0]
  const index = hashString(seed) % palette.length
  return palette[index]
}
