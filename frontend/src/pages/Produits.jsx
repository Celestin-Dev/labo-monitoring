import { FlaskConical } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '../components/AsyncState'
import { useProducts } from '../hooks/useProducts'
import { useZones } from '../hooks/useZones'

const dangerStyles = {
  3: 'bg-status-critical/10 text-status-critical',
  2: 'bg-status-warning/10 text-status-warning',
  1: 'bg-primary-50 text-primary',
  0: 'bg-status-normal/10 text-status-normal',
}
const dangerLabels = { 3: 'CRITIQUE', 2: 'ÉLEVÉ', 1: 'MODÉRÉ', 0: 'FAIBLE' }

function levelStyle(dangerLevel) {
  const rounded = Math.min(3, Math.max(0, Math.round(dangerLevel)))
  return { className: dangerStyles[rounded], label: dangerLabels[rounded] }
}

function ProductCard({ product, zoneName }) {
  const level = levelStyle(product.dangerLevel)
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <FlaskConical size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs text-slate-400">Référence : <span className="font-mono">{product.reference}</span></p>
          </div>
        </div>
        <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${level.className}`}>
          {level.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-400 font-medium mb-1">Zone</dt>
          <dd className="font-semibold text-slate-700">{zoneName}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-400 font-medium mb-1">Humidité max.</dt>
          <dd className="data-value text-slate-700">≤ {product.maxHumidity}%</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 col-span-2">
          <dt className="text-xs text-slate-400 font-medium mb-1">Plage de température</dt>
          <dd className="data-value text-slate-700">{product.minTemperature} → {product.maxTemperature} °C</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Produits() {
  const { products, loading, error, refresh } = useProducts()
  const { zones } = useZones()
  const zoneNameById = Object.fromEntries(zones.map((z) => [z.id, z.name]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Produits chimiques</h1>
        <p className="text-sm text-slate-500 mt-1">Conditions de conservation requises pour chaque produit stocké.</p>
      </div>

      {loading && <LoadingState label="Chargement des produits..." />}
      {!loading && error && <ErrorState message={error.message} onRetry={refresh} />}
      {!loading && !error && products.length === 0 && <EmptyState label="Aucun produit enregistré." />}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} zoneName={zoneNameById[product.zoneId] ?? product.zoneId} />
          ))}
        </div>
      )}
    </div>
  )
}
