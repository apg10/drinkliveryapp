import { useState } from 'react'
import HomeCatalog from './components/HomeCatalog'
import ProductDetail from './components/ProductDetail'
import CheckoutView from './components/CheckoutView'
import OrderConfirmation from './components/OrderConfirmation'
import OrderTracking from './components/OrderTracking'
import AdminOrders from './components/AdminOrders'
import AdminOrderDetail from './components/AdminOrderDetail'
import { getPublicProduct } from './api'

const TENANT_SLUG = 'drinklivery-panama'
const DELIVERY_FEE = 5.99

function App() {
  const [view, setView] = useState('catalog')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [addingToCartFeedback, setAddingToCartFeedback] = useState(false)
  const [orderResponse, setOrderResponse] = useState(null)
  const [trackingOrderCode, setTrackingOrderCode] = useState(null)
  const [adminOrderId, setAdminOrderId] = useState(null)

  async function openDetail(productSlug) {
    setView('detail')
    setLoading(true)
    setDetailError(null)
    try {
      const data = await getPublicProduct(TENANT_SLUG, productSlug)
      setProduct(data)
    } catch (err) {
      setDetailError(err.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  function goBack() {
    setView('catalog')
    setProduct(null)
    setDetailError(null)
  }

  function goHome() {
    setView('catalog')
    setProduct(null)
  }

  function openCart() {
    setView('cart')
  }

  function onAddToCart(newItem) {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.key === newItem.key)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + newItem.quantity }
        return updated
      }
      return [...prev, newItem]
    })
    setAddingToCartFeedback(true)
    setTimeout(() => setAddingToCartFeedback(false), 1200)
  }

  function updateQuantity(key, delta) {
    setCartItems(prev =>
      prev.map(item =>
        item.key === key
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  function removeItem(key) {
    setCartItems(prev => prev.filter(item => item.key !== key))
  }

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTotal = cartSubtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0)

  function handleOrderCreated(order) {
    setOrderResponse(order)
    setCartItems([])
    setView('order-confirmation')
  }

  function handleTrackOrder() {
    setTrackingOrderCode(orderResponse?.order_code)
    setView('tracking')
  }

  function handleReturnToCatalog() {
    setOrderResponse(null)
    setView('catalog')
  }

  function handleOpenAdminOrder(orderId) {
    setAdminOrderId(orderId)
    setView('admin-order-detail')
  }

  function CartView() {
    return (
      <div className="cart-view">
        <div className="cart-view__header">
          <button className="cart-view__back-btn" onClick={goHome} aria-label="Back to catalog">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="cart-view__title">Drinklivery</h1>
          <div className="cart-view__spare" />
        </div>

        <div className="cart-view__body">
          <div className="cart-view__header-row">
            <h2 className="cart-view__section-title">Your Cart</h2>
            {cartTotalItems > 0 && (
              <span className="cart-view__chip">{cartTotalItems} items</span>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-view__empty">
              <span className="cart-view__empty-icon">Cart</span>
              <p className="cart-view__empty-text">Your cart is empty</p>
              <button className="cart-view__empty-btn" onClick={goHome}>Start shopping</button>
            </div>
          ) : (
            <div className="cart-view__items">
              {cartItems.map(item => (
                <div key={item.key} className="cart-item glass-panel">
                  <div className="cart-item__row">
                    <div className="cart-item__img-wrap">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="cart-item__img" />
                      ) : (
                        <div className="cart-item__img-placeholder">Pack</div>
                      )}
                    </div>
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}</h3>
                      {item.variantName && (
                        <p className="cart-item__variant">{item.variantName}</p>
                      )}
                      <p className="cart-item__line-total">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="cart-item__footer">
                    <button className="cart-item__remove" onClick={() => removeItem(item.key)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Remove
                    </button>
                    <div className="cart-item__qty-ctrl">
                      <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.key, -1)} aria-label="Decrease quantity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.key, 1)} aria-label="Increase quantity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              <div className="cart-view__add-more-wrap">
                <button className="cart-view__add-more-btn" onClick={goHome}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add more drinks
                </button>
              </div>

              <div className="cart-view__summary glass-panel">
                <div className="cart-view__summary-row">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="cart-view__summary-row">
                  <span>Delivery fee</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="cart-view__divider" />
                <div className="cart-view__total-row">
                  <span>Total</span>
                  <span className="cart-view__total-value">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-view__compliance">
                <span className="cart-view__compliance-icon">!</span>
                <p className="cart-view__compliance-text">
                  Adult confirmation required. You must present a valid physical ID to the driver upon delivery proving you are of legal drinking age.
                </p>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-view__sticky">
            <button className="cart-view__checkout-btn" onClick={() => setView('checkout')}>
              Continue to checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        )}
      </div>
    )
  }

  if (view === 'cart') {
    return <CartView />
  }

  if (view === 'checkout') {
    return (
      <CheckoutView
        cartItems={cartItems}
        cartSubtotal={cartSubtotal}
        deliveryFee={DELIVERY_FEE}
        onBackToCart={() => setView('cart')}
        onBackToCatalog={goHome}
        onOrderCreated={handleOrderCreated}
      />
    )
  }

  if (view === 'order-confirmation') {
    return <OrderConfirmation order={orderResponse} onReturnToCatalog={handleReturnToCatalog} onTrackOrder={handleTrackOrder} />
  }

  if (view === 'tracking') {
    return <OrderTracking orderCode={trackingOrderCode} onBackToCatalog={handleReturnToCatalog} />
  }

  if (view === 'admin-orders') {
    return <AdminOrders onBackToCatalog={goHome} onOpenOrder={handleOpenAdminOrder} />
  }

  if (view === 'admin-order-detail') {
    return (
      <AdminOrderDetail
        orderId={adminOrderId}
        onBackToList={() => setView('admin-orders')}
        onBackToCatalog={goHome}
      />
    )
  }

  if (view === 'detail') {
    return (
      <>
        {loading && (
          <div className="catalog-state catalog-loading" role="status">
            <span className="catalog-loading-text">Loading product...</span>
          </div>
        )}
        {detailError && (
          <div className="catalog-state catalog-error" role="alert">
            <span className="catalog-error-title">Unable to load product</span>
            <span className="catalog-error-msg">{detailError}</span>
            <button className="catalog-retry-btn" onClick={goBack}>Go Back</button>
          </div>
        )}
        {!loading && product && (
          <ProductDetail
            product={product}
            onBack={goBack}
            onAddToCart={onAddToCart}
            addingFeedback={addingToCartFeedback}
          />
        )}
      </>
    )
  }

  return (
    <>
      <HomeCatalog
        onOpenDetail={openDetail}
        onOpenCart={openCart}
        onOpenAdmin={() => setView('admin-orders')}
        cartCount={cartTotalItems}
        cartSubtotal={cartSubtotal}
      />
    </>
  )
}

export default App
