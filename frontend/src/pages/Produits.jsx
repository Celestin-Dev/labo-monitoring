import { FlaskConical } from 'lucide-react'
import { chemicalProducts } from '../data/mockData'

const levelStyles = {
  CRITIQUE: 'bg-status-critical/10 text-status-critical',
  'ÉLEVÉ': 'bg-status-warning/10 text-status-warning',
  'MODÉRÉ': 'bg-primary-50 text-primary',
  FAIBLE: 'bg-status-normal/10 text-status-normal',
}

function ProductCard({ product }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <FlaskConical size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs text-slate-400">Référence : <span className="font-mono">{product.ref}</span></p>
          </div>
        </div>
        <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${levelStyles[product.level] ?? 'bg-slate-100 text-slate-600'}`}>
          {product.level}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-400 font-medium mb-1">Zone</dt>
          <dd className="font-semibold text-slate-700">Zone {product.zone}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="text-xs text-slate-400 font-medium mb-1">Humidité max.</dt>
          <dd className="data-value text-slate-700">≤ {product.humidityMax}%</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 col-span-2">
          <dt className="text-xs text-slate-400 font-medium mb-1">Plage de température</dt>
          <dd className="data-value text-slate-700">{product.tempMin} → {product.tempMax} °C</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Produits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Produits chimiques</h1>
        <p className="text-sm text-slate-500 mt-1">Conditions de conservation requises pour chaque produit stocké.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {chemicalProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
