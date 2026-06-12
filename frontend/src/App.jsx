import { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import HomeCatalog from './components/HomeCatalog'
import ProductDetail from './components/ProductDetail'
import CheckoutView from './components/CheckoutView'
import OrderConfirmation from './components/OrderConfirmation'
import OrderTracking from './components/OrderTracking'
import AdminOrders from './components/AdminOrders'
import AdminOrderDetail from './components/AdminOrderDetail'
import AccountView from './components/AccountView'
import SupportHelp from './components/SupportHelp'
import OrderDetailsView from './components/OrderDetailsView'
import PartyBuilder from './components/PartyBuilder'
import ExtrasAddOns from './components/ExtrasAddOns'
import { getPublicProduct } from './api'

const TENANT_SLUG = 'drinklivery-panama'
const DELIVERY_FEE = 5.99
const CART_STORAGE_KEY = 'drinklivery.cart.v1'

// ---------- Cart persistence helpers ----------

function normalizeCartItem(item) {
  if (!item || typeof item !== 'object') return null
  const key = item.key
  const name = item.name
  if (typeof key !== 'string' || !name || typeof name !== 'string') return null
  if (item.productId == null) return null
  let quantity = Number(item.quantity)
  if (!Number.isFinite(quantity) || quantity <= 0) quantity = 1
  quantity = Math.max(1, Math.floor(quantity))
  const price = Number(item.price)
  if (!Number.isFinite(price) || price < 0) return null
  return {
    key,
    productId: item.productId,
    variantId: item.variantId ?? null,
    name,
    variantName: (item.variantName != null && item.variantName !== '') ? String(item.variantName) : '',
    price,
    quantity,
    imageUrl: (item.imageUrl != null && item.imageUrl !== '') ? String(item.imageUrl) : '',
    isAlcoholic: Boolean(item.isAlcoholic),
  }
}

function loadCartFromStorage() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const valid = []
    for (const item of parsed) {
      const normalized = normalizeCartItem(item)
      if (normalized) valid.push(normalized)
    }
    return valid
  } catch {
    return []
  }
}

function saveCartToStorage(cartItems) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  } catch {
  }
}

// ---------- Context for shared state ----------
const AppStateCtx = createContext(null)

function useAppState() {
  const ctx = useContext(AppStateCtx)
  if (!ctx) throw new Error('useAppState must be used within App')
  return ctx
}

// ---------- Reduced motion hook ----------
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

// ---------- Route transition wrapper ----------
function PageTransition({ children }) {
  const reduced = useReducedMotionSettings()
  if (reduced) {
    return <>{children}</>
  }
  return (
    <motion.div
      key="page"
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8, massDamping: 0.9 }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Page components that need router hooks ----------

function ProductDetailPage() {
  const navigate = useNavigate()
  const { productSlug } = useParams()
  const app = useAppState()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPublicProduct(TENANT_SLUG, productSlug)
        if (mounted) setProduct(data)
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load product')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [productSlug])

  // Shared loading/error UI as fallback pages (not inside AnimateTransition for cleaner transitions)
  if (loading) {
    return (
      <div className="catalog-state catalog-loading" role="status">
        <span className="catalog-loading-text">Loading product...</span>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="catalog-state catalog-error" role="alert">
        <span className="catalog-error-title">Unable to load product</span>
        <span className="catalog-error-msg">{error}</span>
        <button className="catalog-retry-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    )
  }

  if (!product) return null

  return (
    <ProductDetail
      product={product}
      onBack={() => navigate(-1)}
      onAddToCart={(newItem) => {
        app.setCartItems(prev => {
          const idx = prev.findIndex(i => i.key === newItem.key)
          if (idx !== -1) {
            const u = [...prev]
            u[idx] = { ...u[idx], quantity: u[idx].quantity + newItem.quantity }
            return u
          }
          return [...prev, newItem]
        })
        app.setAddingFeedback(true)
        setTimeout(() => app.setAddingFeedback(false), 1200)
      }}
      addingFeedback={app.addingFeedback}
      onOpenExtras={() => navigate('/extras')}
    />
  )
}

function PublicTrackingPage({ onViewDetails }) {
  const navigate = useNavigate()
  const { orderCode } = useParams()
  return (
    <OrderTracking
      orderCode={orderCode}
      onBackToCatalog={() => navigate('/')}
      onViewDetails={onViewDetails}
    />
  )
}

function AdminDetailPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  return (
    <AdminOrderDetail
      orderId={orderId}
      onBackToList={() => navigate('/admin/orders')}
      onBackToCatalog={() => navigate('/')}
    />
  )
}

// ---------- Cart view as separate component ----------

function CartViewInner() {
  const navigate = useNavigate()
  const app = useAppState()
  const DELIVERY = 5.99
  const [failedImages, setFailedImages] = useState(new Set())
  const cartSubtotal = app.cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const cartTotalItems = app.cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cartSubtotal + (app.cartItems.length > 0 ? DELIVERY : 0)

  function imgError(url) {
    setFailedImages(p => new Set(p).add(url))
  }

  return (
    <div className="cart-view">
      <div className="cart-view__header">
        <button className="cart-view__back-btn" onClick={() => navigate('/')} aria-label="Back to catalog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="cart-view__title">Drinklivery</h1>
        <div className="cart-view__spare" />
      </div>

      <div className="cart-view__body">
        <div className="cart-view__header-row">
          <h2 className="cart-view__section-title">Your Cocktail Box</h2>
          {cartTotalItems > 0 && (<span className="cart-view__chip">{cartTotalItems} items</span>)}
        </div>

        {app.cartItems.length === 0 ? (
          <div className="cart-view__empty">
            <svg className="cart-view__empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <p className="cart-view__empty-text">Your cocktail box is empty</p>
            <button className="cart-view__empty-btn" onClick={() => navigate('/')}>Start building your box</button>
          </div>
        ) : (
          <div className="cart-view__items">
            {app.cartItems.map(item => (
              <div key={item.key} className="cart-item glass-panel">
                <div className="cart-item__row">
                  <div className="cart-item__img-wrap">
                    {item.imageUrl && !failedImages.has(item.imageUrl) ? (
                      <img src={item.imageUrl} alt={item.name} className="cart-item__img" onError={() => imgError(item.imageUrl)} />
                    ) : (<div className="cart-item__img-placeholder">Kit</div>)}
                  </div>
                  <div className="cart-item__info">
                    <h3 className="cart-item__name">{item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}</h3>
                    {item.variantName && (<p className="cart-item__variant">{item.variantName}</p>)}
                    {item.isAlcoholic ? (
                      <p className="cart-item__kit-type">Cocktail kit</p>
                    ) : (
                      <p className="cart-item__kit-type">Mocktail kit</p>
                    )}
                    <p className="cart-item__line-total">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div className="cart-item__footer">
                  <button className="cart-item__remove" onClick={() => app.setCartItems(p => p.filter(i => i.key !== item.key))} aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Remove
                  </button>
                  <div className="cart-item__qty-ctrl">
                    <button className="cart-item__qty-btn" onClick={() => app.updateQuantity(item.key, -1)} aria-label="Decrease quantity">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span className="cart-item__qty-value">{item.quantity}</span>
                    <button className="cart-item__qty-btn" onClick={() => app.updateQuantity(item.key, 1)} aria-label="Increase quantity">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {app.cartItems.length > 0 && (
          <>
            <button className="cart-view__extras-wrap glass-panel cart-view__extras-link" type="button" onClick={() => navigate('/extras')} aria-label="Preview add-ons">
              <svg className="cart-view__extras-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <div>
                <span className="cart-view__extras-label">Add Extras</span>
                <p className="cart-view__extras-subtext">Cups, ice, garnish & snacks</p>
              </div>
              <span className="cart-view__extras-preview">Preview add-ons</span>
            </button>

            <div className="cart-view__add-more-wrap">
              <button className="cart-view__add-more-btn" onClick={() => navigate('/')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add more cocktails
              </button>
            </div>

            <div className="cart-view__summary glass-panel">
              <div className="cart-view__summary-header-row"><span className="cart-view__summary-title">Box summary</span></div>
              <div className="cart-view__summary-row"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
              <div className="cart-view__summary-row"><span>Delivery fee</span><span>${DELIVERY.toFixed(2)}</span></div>
              <div className="cart-view__divider" />
              <div className="cart-view__total-row"><span>Total</span><span className="cart-view__total-value">${cartTotal.toFixed(2)}</span></div>
              <p className="cart-view__delivery-note">Final delivery fee is confirmed at checkout.</p>
            </div>

            <div className="cart-view__compliance">
              <span className="cart-view__compliance-icon">!</span>
              <p className="cart-view__compliance-text">Adult confirmation required. You must present a valid physical ID to the driver upon delivery proving you are of legal drinking age.</p>
            </div>
          </>
        )}
      </div>

      {app.cartItems.length > 0 && (
        <div className="cart-view__sticky">
          <button className="cart-view__checkout-btn" onClick={() => navigate('/checkout')}>
            Continue to checkout
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- Page-level component (wraps App provider) ----------

function AllRoutes() {
  const location = useLocation()
  const navigate = useNavigate()
  const app = useAppState()

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={
          <PageTransition>
            <HomeCatalog
              onOpenDetail={(slug) => navigate(`/products/${slug}`)}
              onOpenCart={() => navigate('/cart')}
              onOpenAdmin={() => navigate('/admin/orders')}
              onNavigateAccount={() => navigate('/account')}
              onNavigatePartyBuilder={() => navigate('/party-builder')}
              cartCount={app.cartTotalItems}
              cartSubtotal={app.cartSubtotal}
            />
          </PageTransition>
        } />
        <Route path="/products/:productSlug" element={
          <PageTransition><ProductDetailPage /></PageTransition>
        } />
        <Route path="/cart" element={
          <PageTransition><CartViewInner /></PageTransition>
        } />
        <Route path="/checkout" element={
          <PageTransition>
            <CheckoutView
              cartItems={app.cartItems}
              cartSubtotal={app.cartSubtotal}
              deliveryFee={DELIVERY_FEE}
              onBackToCart={() => navigate('/cart')}
              onBackToCatalog={() => navigate('/')}
              onOrderCreated={(order) => {
                app.setCartItems([])
                app.setOrderResponse(order)
                navigate('/order-confirmation')
              }}
              onOpenExtras={() => navigate('/extras')}
            />
          </PageTransition>
        } />
        <Route path="/order-confirmation" element={
          <PageTransition>
            <OrderConfirmation
              order={app.orderResponse || null}
              onReturnToCatalog={() => {
                if (app.orderResponse) app.setOrderResponse(null)
                navigate('/')
              }}
              onTrackOrder={() => {
                const code = app.orderResponse?.order_code
                if (code) navigate(`/orders/${code}`)
                else navigate('/')
              }}
              onViewDetails={() => navigate('/order-details')}
            />
          </PageTransition>
        } />
        <Route path="/orders/:orderCode" element={
          <PageTransition>
            <PublicTrackingPage onViewDetails={() => navigate('/order-details')} />
          </PageTransition>
        } />
        <Route path="/admin/orders" element={
          <PageTransition>
            <AdminOrders
              onBackToCatalog={() => navigate('/')}
              onOpenOrder={(id) => navigate(`/admin/orders/${id}`)}
            />
          </PageTransition>
        } />
        <Route path="/admin/orders/:orderId" element={
          <PageTransition><AdminDetailPage /></PageTransition>
        } />
        <Route path="/account" element={
          <PageTransition><AccountView order={app.orderResponse || null} /></PageTransition>
        } />
        <Route path="/support" element={
          <PageTransition><SupportHelp /></PageTransition>
        } />
        <Route path="/order-details" element={
          <PageTransition>
            <OrderDetailsView order={app.orderResponse || null} onBackToCatalog={() => navigate('/')} />
          </PageTransition>
        } />
        <Route path="/party-builder" element={
          <PageTransition>
            <PartyBuilder onBrowseCatalog={() => navigate('/')} />
          </PageTransition>
        } />
        <Route path="/extras" element={
          <PageTransition>
            <ExtrasAddOns />
          </PageTransition>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

// ---------- Entry point App ----------

function App() {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage())
  const [addingFeedback, setAddingFeedback] = useState(false)
  const [orderResponse, setOrderResponse] = useState(null)
  const _initializedRef = useRef(false)

  useEffect(() => {
    if (!_initializedRef.current) {
      _initializedRef.current = true
      return
    }
    saveCartToStorage(cartItems)
  }, [cartItems])

  function updateQuantity(key, delta) {
    setCartItems(prev =>
      prev.map(item =>
        item.key === key
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const ctxValue = useMemo(() => ({
    cartItems, setCartItems,
    addingFeedback, setAddingFeedback,
    orderResponse, setOrderResponse,
    updateQuantity,
    get cartTotalItems() { return cartTotalItems },
    get cartSubtotal() { return cartSubtotal },
  }), [cartItems, addingFeedback, orderResponse, cartTotalItems, cartSubtotal])

  return (
    <AppStateCtx.Provider value={ctxValue}>
      <AllRoutes />
    </AppStateCtx.Provider>
  )
}

export default App
