import { useState, useMemo } from 'react'

const GUEST_OPTIONS = [4, 8, 12, 16]
const STYLE_OPTIONS = ['Tropical', 'Classic', 'Mixed', 'Mocktail']

export default function PartyBuilder({ onBrowseCatalog }) {
  const [guestCount, setGuestCount] = useState(8)
  const [style, setStyle] = useState('Tropical')

  const recommendation = useMemo(() => {
    const kits = guestCount <= 4 ? 1 : guestCount <= 8 ? 2 : guestCount <= 12 ? 3 : 4
    const iceLbs = Math.round(kits * 2.5)
    const garnishMap = { Tropical: 'Seasonal tropical fruits', Classic: 'Citrus wheels & herbs', Mixed: 'Fruit medley & edible flowers', Mocktail: 'Fresh herbs & seasonal berries' }
    const snackSuggestions = guestCount <= 8 ? ['Charcuterie mini-platter', 'Coconut poppers'] : ['Loaded nacho platter', 'Spring roll sampler', 'Grilled skewer trio']

    return {
      kits,
      iceLbs,
      garnish: garnishMap[style] || 'Seasonal fruit',
      cupsNote: style === 'Mocktail' ? 'Non-alcoholic mocktail cups included.' : 'Cocktail cups included.',
      snackSuggestions,
    }
  }, [guestCount, style])

  const isMocktail = style === 'Mocktail'

  return (
    <div className="party-builder app-subview">
      <header className="app-subview__topbar">
        <button className="app-subview__back" type="button" onClick={() => onBrowseCatalog?.()} aria-label="Back to catalog">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="app-subview__brand">Drinklivery</span>
        <span className="app-subview__spacer" />
      </header>

      <main className="app-subview__body">
        {/* Header */}
        <div className="party-builder__header glass-panel">
          <span className="party-builder__eyebrow">Planner</span>
          <h1 className="party-builder__title">Party Builder</h1>
          <p className="party-builder__subtitle">Tell us your guest count and we'll suggest a cocktail box.</p>
        </div>

      {/* Guest count selector */}
      <div className="party-builder__section">
        <label className="party-builder__label" htmlFor="guest-count">Number of guests</label>
        <div className="party-builder__selector-grid" role="radiogroup" aria-label="Guest count">
          {GUEST_OPTIONS.map(n => (
            <button
              key={n}
              role="radio"
              aria-checked={guestCount === n}
              className={`party-builder__selector-option${guestCount === n ? ' party-builder__selector-option--active' : ''}`}
              onClick={() => setGuestCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Style selector */}
      <div className="party-builder__section">
        <label className="party-builder__label" htmlFor="style-select">Party style</label>
        <select
          id="style-select"
          className="party-builder__style-select"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          {STYLE_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Recommendation card */}
      <div className="party-builder__rec glass-panel">
        <h2 className="party-builder__rec-title">Your suggested box</h2>

        <div className="party-builder__rec-row">
          <span className="party-builder__rec-label">Kits</span>
          <span className="party-builder__rec-value">{recommendation.kits}x {isMocktail ? 'mocktail box' : 'cocktail kit'}{recommendation.kits > 1 ? 's' : ''}</span>
        </div>
        <div className="party-builder__rec-row">
          <span className="party-builder__rec-label">Ice</span>
          <span className="party-builder__rec-value">{recommendation.iceLbs} lbs</span>
        </div>
        <div className="party-builder__rec-row">
          <span className="party-builder__rec-label">Garnish</span>
          <span className="party-builder__rec-value">{recommendation.garnish}</span>
        </div>
        <div className="party-builder__rec-row">
          <span className="party-builder__rec-label">Cups</span>
          <span className="party-builder__rec-value">{recommendation.cupsNote}</span>
        </div>

        <div className="party-builder__snack-section">
          <span className="party-builder__snack-label">Add-on suggestions</span>
          <ul className="party-builder__snack-list">
            {recommendation.snackSuggestions.map((s, i) => (
              <li key={i} className="party-builder__snack-item">{s}</li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <button className="primary-btn party-builder__add-cta" disabled aria-disabled="true">
          Add generated box — coming soon
        </button>
        <button className="secondary-link-btn" onClick={() => { if (onBrowseCatalog) onBrowseCatalog(); }} style={{ marginTop: '8px' }}>
          {isMocktail ? 'Browse mocktail boxes' : 'Browse cocktail kits'}
        </button>
      </div>

      {/* Mocktail note */}
      {isMocktail && (
        <div className="party-builder__mocktail-note glass-panel">
          <p className="party-builder__mocktail-text">This mocktail box contains zero alcohol and is suitable for all ages.</p>
        </div>
      )}

      {/* Backend limitation note */}
      <div className="party-builder__note glass-panel">
        <p className="party-builder__note-text">
          Note: Party Builder currently provides frontend-only recommendations. True bundle generation requires backend support for bundle orders or a supported cart item schema.
        </p>
      </div>
      </main>
    </div>
  )
}
