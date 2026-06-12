import { useNavigate } from 'react-router-dom'

const ADDONS = [
  {
    id: 'disposable-cups',
    name: 'Disposable cups',
    description: 'Pack of party-sized disposable cups, perfect for serving.',
    priceText: 'Price confirmed at checkout soon',
  },
  {
    id: 'reusable-cups',
    name: 'Reusable cups',
    description: 'Eco-friendly reusable cups for your next event.',
    priceText: 'Price confirmed at checkout soon',
  },
  {
    id: 'extra-ice',
    name: 'Extra ice',
    description: 'Additional crushed or cubed ice to keep drinks chilled.',
    priceText: 'Price confirmed at checkout soon',
  },
  {
    id: 'extra-garnish',
    name: 'Extra garnish',
    description: 'Fresh citrus wheels, herbs, and edible flowers.',
    priceText: 'Price confirmed at checkout soon',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    description: 'Mini platters, skewers, and bite-sized snacks to complement your box.',
    priceText: 'Price confirmed at checkout soon',
  },
]

export default function ExtrasAddOns() {
  const navigate = useNavigate()

  return (
    <div className="extras-add-ons">
      <div className="extras-add-ons__header glass-panel">
        <h1 className="extras-add-ons__title">Extras &amp; Add-ons</h1>
        <p className="extras-add-ons__subtitle">
          Complete your cocktail box with cups, extra ice, garnish, and snacks.
        </p>
        <div className="extras-add-ons__positioning-note glass-panel">
          <p>
            Add-ons are being prepared for a future cart update. Extras will be added directly to your order at checkout once backend support is live.
          </p>
        </div>
      </div>

      <div className="extras-add-ons__grid">
        {ADDONS.map(addon => (
          <div key={addon.id} className="extras-add-ons__card glass-panel">
            <h3 className="extras-add-ons__card-title">{addon.name}</h3>
            <p className="extras-add-ons__card-desc">{addon.description}</p>
            <span className="extras-add-ons__card-price">{addon.priceText}</span>
            <button className="extras-add-ons__card-btn" disabled aria-disabled="true">
              Coming soon
            </button>
          </div>
        ))}
      </div>

      <div className="extras-add-ons__back-wrap">
        <button className="secondary-link-btn extras-add-ons__back-btn" onClick={() => navigate('/')}>
          Back to catalog
        </button>
      </div>
    </div>
  )
}
