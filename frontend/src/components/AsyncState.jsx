import { Loader2, AlertTriangle } from 'lucide-react'

export function LoadingState({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-slate-400">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-status-critical/10 text-status-critical">
        <AlertTriangle size={20} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Impossible de charger les données</p>
        <p className="mt-1 text-xs text-slate-400">{message || "Vérifiez que le backend tourne sur l'URL configurée."}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline text-xs px-3 py-1.5 mt-1">
          Réessayer
        </button>
      )}
    </div>
  )
}

export function EmptyState({ label = 'Aucune donnée à afficher.' }) {
  return (
    <div className="py-16 text-sm text-center text-slate-400">{label}</div>
  )
}