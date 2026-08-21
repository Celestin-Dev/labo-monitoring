import { STATUS_META } from '../lib/status'

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] ?? STATUS_META.offline
  const sizeCls = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${meta.bg} ${meta.text} ${sizeCls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export function StatusDot({ status, className = '' }) {
  const meta = STATUS_META[status] ?? STATUS_META.offline
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.dot} ${className}`} />
}
