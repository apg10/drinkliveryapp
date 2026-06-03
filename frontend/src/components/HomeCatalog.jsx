import { useState, useEffect } from 'react'
import { getPublicCatalog } from '../api'
import './HomeCatalog.css'

const TENANT_SLUG = 'drinklivery-panama'

const NAV_ITEMS = [
  { label: 'Explore', active: true, icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )},
  { label: 'Cart', active: false, icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )},
]

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
      {/* Top App Bar */}
      <header className="top-bar">
        <div className="container top-bar__inner">
          <div className="top-bar__brand">
            <span className="top-bar__brand-icon">D</span>
            <span>Drinklivery</span>
          </div>
          <div className="top-bar__actions">
            {onOpenAdmin && (
              <button
                className="top-bar__admin-link"
                onClick={onOpenAdmin}
                aria-label="Admin"
                title="Admin"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container catalog-main">
        {/* Hero */}
        <section className="hero hero--compact">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__content">
              <h1 className="hero__title">Cocktails ready for your night</h1>
              <p className="hero__subtitle">
                Premium ready-to-serve cocktail and mocktail packs in Panama City.
              </p>
              <div className="hero__age-badge">
                <span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 9v4"/><circle cx="12" cy="16" r=".5"/></svg></span>
                <span>Must be of legal drinking age to purchase alcohol</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="categories">
          <div className="categories__list">
            <button
              className={`chip ${activeCat === null ? 'chip--active' : 'chip--inactive'}`}
              onClick={() => handleCatToggle(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id || cat.slug}
                className={`chip ${activeCat === cat.slug ? 'chip--active' : 'chip--inactive'}`}
                onClick={() => handleCatToggle(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="product-grid">
          {visibleProducts.map(product => {
            const alcoholic = product.is_alcoholic === true
            const badgeLabel = alcoholic ? 'Alcohol' : 'Mocktail'
            const badgeClass = alcoholic
              ? 'product-card__badge-text--alcoholic'
              : 'product-card__badge-text--mocktail'
            const dotClass = alcoholic
              ? 'product-card__badge-dot--alcoholic'
              : 'product-card__badge-dot--mocktail'

            return (
              <article key={product.id} className="product-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => onOpenDetail && onOpenDetail(product.slug || product.id)}>
                <div className="product-card__img-wrap">
                  <div className="product-card__badge">
                    <span className={`product-card__badge-dot ${dotClass}`} />
                    <span className={`product-card__badge-text ${badgeClass}`}>
                      {badgeLabel}
                    </span>
                  </div>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-card__image" />
                  ) : (
                    <div
                      className="product-card__img-placeholder product-card__placeholder"
                      aria-hidden="true"
                    >
                      <span className="product-card__placeholder-text">
                        {alcoholic ? 'Cocktail' : 'Mocktail'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__name">{product.name}</h3>
                  {product.description && (
                    <p className="product-card__desc">{product.description}</p>
                  )}
                  <div className="product-card__footer">
                    <div className="product-card__price-wrap">
                      <span className="product-card__price">${product.base_price}</span>
                      {product.servings != null && (
                        <span className="product-card__servings">Serves {product.servings}</span>
                      )}
                    </div>
                    <button
                      className="product-card__add"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail && onOpenDetail(product.slug || product.id)
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      {/* Sticky View Cart Bar */}
      {cartCount > 0 && (
        <div className="cart-bar">
          <button className="cart-bar__btn" onClick={onOpenCart}>
            <span className="cart-bar__label">View cart</span>
            <span className="cart-bar__total">
              {cartCount} item{cartCount === 1 ? '' : 's'} · ${cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Bottom Nav (mobile only) */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="bottom-nav__inner">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`nav-item ${item.active ? 'nav-item--active' : ''}`}
              aria-label={item.label}
              onClick={item.label === 'Cart' ? onOpenCart : undefined}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
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
