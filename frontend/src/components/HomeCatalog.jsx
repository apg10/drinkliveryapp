import { useState, useEffect } from 'react'
import { getPublicCatalog } from '../api'
import './HomeCatalog.css'

const NAV_ITEMS = [
  { label: 'Explore', icon: 'Ex', active: true },
  { label: 'Events', icon: 'Ev', active: false },
  { label: 'Cart', icon: 'Bag', active: false },
  { label: 'Account', icon: 'Me', active: false },
]

const TENANT_SLUG = 'drinklivery-panama'

function HomeCatalog({ onOpenDetail, onOpenCart, cartCount = 0, cartSubtotal = 0 }) {
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
          <button className="top-bar__avatar" aria-label="Account">
            A
          </button>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <section className="hero">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__content">
              <h1 className="hero__title">Cocktails ready for your night</h1>
              <p className="hero__subtitle">
                Premium ready-to-serve cocktail and mocktail packs in Panama City.
              </p>
              <div className="hero__age-badge">
                <span>ID</span>
                <span>Must be of legal drinking age to purchase alcohol</span>
              </div>
            </div>
            <div className="hero__image-wrap">
              <img
                src="https://picsum.photos/seed/drinklivery/384/384"
                alt="Drinklivery"
                className="hero__image"
              />
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
            const badgeLabel = alcoholic ? 'Alcoholic' : 'Non-alcoholic'
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
                    <img src={product.image} alt={product.name} className="product-card__image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div
                      className="product-card__img-placeholder"
                      aria-hidden="true"
                    >
                      <span>DR</span>
                    </div>
                  )}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  {product.servings != null && (
                    <p className="product-card__servings">
                      Serves {product.servings}
                    </p>
                  )}
                  <div className="product-card__footer">
                    <span className="product-card__price">
                      ${product.base_price}
                    </span>
                    <button
                      className="product-card__add"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail && onOpenDetail(product.slug || product.id)
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      {/* Sticky View Cart Bar */}
      <div className="cart-bar">
        <button className="cart-bar__btn" onClick={onOpenCart}>
          <span className="cart-bar__label">View cart</span>
          <span className="cart-bar__total">
            {cartCount > 0 ? `${cartCount} item${cartCount === 1 ? '' : 's'} · $${cartSubtotal.toFixed(2)}` : '$0.00'}
          </span>
        </button>
      </div>

      {/* Bottom Nav (mobile only) */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="bottom-nav__inner">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`nav-item ${
                item.active ? 'nav-item--active' : ''
              }`}
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
