import { StatusDot } from './StatusBadge'

const iconMap = {
  temperature: '🌡️',
}

export default function StatCard({ icon: Icon, label, value, unit, status }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="data-value text-2xl text-slate-900">
          {value}
          <span className="text-base font-medium text-slate-400 ml-0.5">{unit}</span>
        </p>
        <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
          <Icon size={20} strokeWidth={2} />
        </div>
        <StatusDot status={status} />
      </div>
    </div>
  )
}
