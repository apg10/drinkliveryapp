import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getPublicCatalog } from '../api'
import './HomeCatalog.css'

const TENANT_SLUG = 'drinklivery-panama'

function useReducedMotionSettings() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const handler = (e) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return reduced
}

const ALCOHOLIC_ICON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2 12 7 16 2"/><path d="M12 7v13"/><path d="M8 22h8"/></svg>
)

const MOCKTAIL_ICON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 8 7h8l-4-5z"/><path d="M12 7v15"/><path d="M8 22h8"/></svg>
)

function HomeCatalog({
  onOpenDetail,
  onOpenCart,
  onOpenAdmin,
  onNavigateAccount,
  onNavigateSupport,
  onNavigatePartyBuilder,
  onNavigateExtras,
  cartCount = 0,
  cartSubtotal = 0,
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCat, setActiveCat] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [failedImages, setFailedImages] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const reducedMotion = useReducedMotionSettings()

  function handleImageError(imageUrl) {
    setFailedImages(prev => {
      const next = new Set(prev)
      next.add(imageUrl)
      return next
    })
  }

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

  const filteredBySearch = searchQuery.trim()
    ? products.filter(p => {
        const q = searchQuery.toLowerCase()
        return (
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.categoryName || '').toLowerCase().includes(q) ||
          String((p.is_alcoholic === true) ? 'alcoholic' : 'mocktail').includes(q)
        )
      })
    : products

  const visibleProducts = activeCat
    ? filteredBySearch.filter(p => p.categorySlug === activeCat)
    : filteredBySearch

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
            <button className="premium-topbar__avatar" aria-label="Profile" onClick={() => onNavigateAccount?.()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="premium-main">
        {/* Hero */}
        <motion.section
          className="premium-hero"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={!reducedMotion ? { type: 'spring', stiffness: 380, damping: 28, mass: 0.9, delay: 0.05 } : undefined}
        >
          <div className="premium-hero__glow" aria-hidden="true" />
          <div className="premium-hero__inner">
            <span className="premium-hero__eyebrow">Panama cocktail delivery</span>
            <h1 className="premium-hero__title">Tonight Starts Here</h1>
            <p className="premium-hero__subtitle">Premium cocktail kits delivered cold, sealed, and ready to serve.</p>
            <div className="premium-hero__actions" aria-label="Start ordering">
              <button className="premium-hero__primary" onClick={() => document.getElementById('popular-tonight')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop kits
              </button>
              {onNavigatePartyBuilder && (
                <button className="premium-hero__secondary" onClick={onNavigatePartyBuilder}>
                  Build party box
                </button>
              )}
            </div>
            <div className="premium-hero__stats" aria-label="Delivery highlights">
              <span>Cold sealed kits</span>
              <span>Fresh garnish</span>
              <span>ID checked</span>
            </div>
            <div className="premium-hero__age">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 9v4"/><circle cx="12" cy="16" r=".5"/></svg>
              <span>Must be of legal drinking age to purchase alcohol</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="home-actions"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={!reducedMotion ? { type: 'spring', stiffness: 380, damping: 28, mass: 0.9, delay: 0.1 } : undefined}
          aria-label="Drinklivery app shortcuts"
        >
          <button className="home-action home-action--featured" onClick={() => onNavigatePartyBuilder?.()}>
            <span className="home-action__label">Party Builder</span>
            <span className="home-action__copy">Tell us the group size and we guide the box.</span>
          </button>
          <button className="home-action" onClick={() => onNavigateExtras?.()}>
            <span className="home-action__label">Extras</span>
            <span className="home-action__copy">Ice, mixers, cups and garnish add-ons.</span>
          </button>
          <button className="home-action" onClick={() => onNavigateSupport?.()}>
            <span className="home-action__label">Help</span>
            <span className="home-action__copy">Delivery zones, ID policy and payment help.</span>
          </button>
        </motion.section>

        <section className="home-story" aria-label="How Drinklivery works">
          <h2 className="home-story__title">Your bar cart, handled</h2>
          <div className="home-story__steps">
            <span>Pick a kit</span>
            <span>Add extras</span>
            <span>Serve cold</span>
          </div>
        </section>

        {/* Horizontal category chips */}
        <motion.section
          className="premium-chips"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={!reducedMotion ? { type: 'spring', stiffness: 380, damping: 28, mass: 0.9, delay: 0.12 } : undefined}
        >
          <div className="premium-chips__list">
            <button
              className={`premium-chip ${activeCat === null ? 'premium-chip--active' : 'premium-chip--inactive'}`}
              onClick={() => handleCatToggle(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <motion.button
                key={cat.id || cat.slug}
                className={`premium-chip ${activeCat === cat.slug ? 'premium-chip--active' : 'premium-chip--inactive'}`}
                onClick={() => handleCatToggle(cat.slug)}
                whileTap={!reducedMotion ? { scale: 0.94 } : undefined}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.section>
        {/* Search input */}
        <motion.section
          className="premium-search"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={!reducedMotion ? { type: 'spring', stiffness: 380, damping: 28, mass: 0.9, delay: 0.06 } : undefined}
        >
          <div className="premium-search__input-wrap">
            <svg className="premium-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              className="premium-search__input"
              type="text"
              placeholder="Search cocktails, mocktails, add-ons..."
              aria-label="Search products"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="premium-search__clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>
        </motion.section>

      {/* Product grid */}
          <h2 className="premium-grid__heading" id="popular-tonight">Popular Tonight</h2>

        <section className="premium-grid">
          {visibleProducts.map(product => {
            const alcoholic = product.is_alcoholic === true
            const badgeText = alcoholic ? 'Alcoholic' : 'Non-alcoholic'
            const cardAnimConfig = !reducedMotion ? { type: 'spring', stiffness: 320, damping: 26, mass: 0.85, delay: 0.06 } : undefined

            return (
              <motion.article
                key={product.id}
                className="premium-card glass-panel"
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenDetail && onOpenDetail(product.slug || product.id)}
                initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.975 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={!reducedMotion ? { opacity: 0, scale: 0.95 } : undefined}
                transition={cardAnimConfig}
              >
                <div className="premium-card__visual">
                  <span
                    className={`premium-card__badge ${alcoholic ? 'premium-card__badge--alcoholic' : 'premium-card__badge--mocktail'}`}
                  >
                    {alcoholic ? ALCOHOLIC_ICON : MOCKTAIL_ICON}
                    {badgeText}
                  </span>
                  {(product.image && !failedImages.has(product.image)) ? (
                    <img src={product.image} alt={product.name} className="premium-card__image" onError={() => handleImageError(product.image)} />
                  ) : (
                    <div
                      className={`premium-card__fallback ${alcoholic ? 'premium-card__fallback--cocktail' : 'premium-card__fallback--mocktail'}`}
                      aria-hidden="true"
                    >
                      <span className={`premium-card__fallback-label ${!alcoholic ? 'premium-card__fallback-label--mocktail' : ''}`}>
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
                  <span className="premium-card__kit-copy">Mix + garnish + ice</span>
                  <div className="premium-card__footer">
                    <div className="premium-card__price-wrap">
                      <span className="premium-card__price">${product.base_price}</span>
                      {product.servings != null && (
                        <span className="premium-card__servings">Serves {product.servings}</span>
                      )}
                    </div>
                    <motion.button
                      className="premium-card__add"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail && onOpenDetail(product.slug || product.id)
                      }}
                      whileHover={!reducedMotion ? { scale: 1.08 } : undefined}
                      whileTap={!reducedMotion ? { scale: 0.9 } : undefined}
                      transition={!reducedMotion ? { type: 'spring', stiffness: 400, damping: 18 } : undefined}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        {visibleProducts.length === 0 && (searchQuery || activeCat) && !error && (
          <div className="catalog-state catalog-empty catalog-filtered" role="status">
            <span className="catalog-empty-title">No matching cocktail kits</span>
            <span className="catalog-empty-sub">Try adjusting your search or category filter.</span>
          </div>
        )}
        </section>
      </main>

      {/* Floating cart bar */}
      {reducedMotion ? (
        <AnimatePresence initial={false}>
          {cartCount > 0 && (
            <div className="premium-cart-bar" key="cart-bar-static">
              <button className="premium-cart-bar__btn" onClick={onOpenCart}>
                <div className="premium-cart-bar__info">
                  <span className="premium-cart-bar__count">{cartCount}</span>
                  <div className="premium-cart-bar__text">
                    <span className="premium-cart-bar__label">Total</span>
                    <span className="premium-cart-bar__total-val">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>
                <span className="premium-cart-bar__cta">View box</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      ) : (
        <AnimatePresence initial={false} mode="wait">
          {cartCount > 0 && (
            <motion.div
              className="premium-cart-bar"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.9 }}
              key="cart-bar"
            >
              <button className="premium-cart-bar__btn" onClick={onOpenCart}>
                <div className="premium-cart-bar__info">
                  <span className="premium-cart-bar__count">{cartCount}</span>
                  <div className="premium-cart-bar__text">
                    <span className="premium-cart-bar__label">Total</span>
                    <span className="premium-cart-bar__total-val">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>
                <span className="premium-cart-bar__cta">View box</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
          <button className="premium-nav-item" aria-label="Party Builder" onClick={() => onNavigatePartyBuilder?.()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2h8l-2 7h5l-9 13 2-9H7l1-11Z"/>
            </svg>
            <span>Party</span>
          </button>
          <button className="premium-nav-item" aria-label="Extras" onClick={() => onNavigateExtras?.()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Extras</span>
          </button>
          <button className="premium-nav-item" aria-label="Cart" onClick={onOpenCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>{cartCount > 0 ? `Box (${cartCount})` : 'Box'}</span>
          </button>
          <button className="premium-nav-item" aria-label="Account" onClick={() => onNavigateAccount?.()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/>
            </svg>
            <span>Account</span>
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
