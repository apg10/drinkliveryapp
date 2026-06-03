import { useState, useEffect } from 'react'
import { getPublicCatalog } from '../api'
import './HomeCatalog.css'

const TENANT_SLUG = 'drinklivery-panama'

const ALCOHOLIC_ICON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2 12 7 16 2"/><path d="M12 7v13"/><path d="M8 22h8"/></svg>
)

const MOCKTAIL_ICON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 8 7h8l-4-5z"/><path d="M12 7v15"/><path d="M8 22h8"/></svg>
)

function HomeCatalog({ onOpenDetail, onOpenCart, onOpenAdmin, cartCount = 0, cartSubtotal = 0 }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCat, setActiveCat] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let mounted = true

    async function fetchCatalog() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPublicCatalog(TENANT_SLUG)
        if (!mounted) return
        const apiCategories = data.categories || []
        setCategories(apiCategories)
        setProducts(
          apiCategories.flatMap(category =>
            (category.products || []).map(product => ({
              ...product,
              categoryName: category.name,
              categorySlug: category.slug,
            }))
          )
        )
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Failed to load catalog')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCatalog()
    return () => { mounted = false }
  }, [reloadKey])

  function handleCatToggle(categorySlug) {
    if (activeCat === categorySlug) return
    setActiveCat(categorySlug)
  }

  const visibleProducts = activeCat
    ? products.filter(p => p.categorySlug === activeCat)
    : products

  return (
    <>
      {/* Glass top bar */}
      <header className="premium-topbar">
        <div className="premium-topbar__inner">
          <button className="premium-topbar__location" onClick={onOpenDetail && (() => {})} aria-label="Location">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
          <span className="premium-topbar__brand">Drinklivery</span>
          <div className="premium-topbar__right">
            {onOpenAdmin && (
              <button
                className="premium-topbar__admin"
                onClick={onOpenAdmin}
                aria-label="Admin"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            )}
            <button className="premium-topbar__avatar" aria-label="Profile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="premium-main">
        {/* Hero */}
        <section className="premium-hero">
          <div className="premium-hero__glow" aria-hidden="true" />
          <div className="premium-hero__inner">
            <h1 className="premium-hero__title">Cocktails ready for your night</h1>
            <p className="premium-hero__subtitle">Premium, bar-quality drinks delivered chilled to your door.</p>
            <div className="premium-hero__age">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 9v4"/><circle cx="12" cy="16" r=".5"/></svg>
              <span>Must be of legal drinking age to purchase alcohol</span>
            </div>
          </div>
        </section>

        {/* Horizontal category chips */}
        <section className="premium-chips">
          <div className="premium-chips__list">
            <button
              className={`premium-chip ${activeCat === null ? 'premium-chip--active' : 'premium-chip--inactive'}`}
              onClick={() => handleCatToggle(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id || cat.slug}
                className={`premium-chip ${activeCat === cat.slug ? 'premium-chip--active' : 'premium-chip--inactive'}`}
                onClick={() => handleCatToggle(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Product grid */}
        <section className="premium-grid">
          {visibleProducts.map(product => {
            const alcoholic = product.is_alcoholic === true
            const badgeBg = alcoholic
              ? 'linear-gradient(135deg, rgba(160,215,87,0.15), rgba(238,192,88,0.15))'
              : 'linear-gradient(135deg, rgba(238,192,88,0.15), rgba(160,215,87,0.15))'
            const badgeColor = alcoholic ? 'var(--secondary)' : 'var(--tertiary)'
            const badgeText = alcoholic ? 'Alcoholic' : 'Non-alcoholic'

            return (
              <article
                key={product.id}
                className="premium-card glass-panel"
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenDetail && onOpenDetail(product.slug || product.id)}
              >
                <div className="premium-card__visual">
                  <span
                    className="premium-card__badge"
                    style={{ background: badgeBg, color: badgeColor }}
                  >
                    {alcoholic ? ALCOHOLIC_ICON : MOCKTAIL_ICON}
                    {badgeText}
                  </span>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="premium-card__image" />
                  ) : (
                    <div className="premium-card__fallback" aria-hidden="true">
                      <span className="premium-card__fallback-label">
                        {alcoholic ? 'Cocktail' : 'Mocktail'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="premium-card__body">
                  <h3 className="premium-card__name">{product.name}</h3>
                  {product.description && (
                    <p className="premium-card__desc">{product.description}</p>
                  )}
                  <div className="premium-card__footer">
                    <div className="premium-card__price-wrap">
                      <span className="premium-card__price">${product.base_price}</span>
                      {product.servings != null && (
                        <span className="premium-card__servings">Serves {product.servings}</span>
                      )}
                    </div>
                    <button
                      className="premium-card__add"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail && onOpenDetail(product.slug || product.id)
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div className="premium-cart-bar">
          <button className="premium-cart-bar__btn" onClick={onOpenCart}>
            <div className="premium-cart-bar__info">
              <span className="premium-cart-bar__count">{cartCount}</span>
              <div className="premium-cart-bar__text">
                <span className="premium-cart-bar__label">Total</span>
                <span className="premium-cart-bar__total-val">${cartSubtotal.toFixed(2)}</span>
              </div>
            </div>
            <span className="premium-cart-bar__cta">View cart</span>
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="premium-nav" aria-label="Main navigation">
        <div className="premium-nav__inner">
          <button className="premium-nav-item premium-nav-item--active" aria-label="Explore">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Explore</span>
          </button>
          <button className="premium-nav-item" aria-label="Cart" onClick={onOpenCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>{cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}</span>
          </button>
        </div>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="catalog-state catalog-loading" role="status">
          <span className="catalog-loading-text">Loading catalog...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="catalog-state catalog-error" role="alert">
          <span className="catalog-error-title">Unable to load catalog</span>
          <span className="catalog-error-msg">{error}</span>
          <button
            className="catalog-retry-btn"
            onClick={() => setReloadKey(key => key + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="catalog-state catalog-empty" role="status">
          <span className="catalog-empty-title">No products available</span>
        </div>
      )}
    </>
  )
}

export default HomeCatalog
