import { useNavigate } from 'react'

export default function OrderDetailsView({ order, onBackToCatalog }) {
  const navigate = useNavigate()

  if (!order) {
    return (
      <div className="order-details-view">
        <div className="order-details-view__hero order-details-view__hero--empty">
          <h1 className="order-details-view__title">Order Details</h1>
          <p className="order-details-view__empty-text">No recent order details available.</p>
          <div className="order-details-view__actions">
            <button className="primary-btn" onClick={() => navigate('/')}>
              Return to catalog
            </button>
            <button className="secondary-link-btn" onClick={() => navigate('/account')}>
              Account / Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const items = Array.isArray(order.items) ? order.items : []
  const hasItems = items.length > 0
  const hasDeliveryArea = !!(order.delivery_area || order.delivery_address)
  const hasCustomerInfo = !!(order.customer_name || order.customer_phone || order.customer_email)

  return (
    <div className="order-details-view">
      {/* Header */}
      <div className="order-details-view__header">
        <button
          className="order-details-view__back-btn"
          onClick={onBackToCatalog || (() => navigate('/'))}
          aria-label="Back to catalog"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="order-details-view__title">Order Details</h1>
        <div className="order-details-view__spacer" />
      </div>

      {/* Hero confirmation */}
      <div className="order-details-view__hero glass-panel">
        <div className="order-details-view__icon-wrap">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-container)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 className="order-details-view__hero-title">Order confirmed</h2>
        <p className="order-details-view__hero-sub">Your cocktail box is prepared cold, sealed, and ready to serve.</p>

        <div className="order-details-view__code-section">
          <span className="order-details-view__code-label">Order code</span>
          <span className="order-details-view__code-value">{order.order_code || 'N/A'}</span>
        </div>
      </div>

      {/* Key details */}
      <dl className="order-details-view__details">
        <div className="order-details-view__detail-row">
          <dt className="order-details-view__detail-label">Status</dt>
          <dd className={`order-details-view__detail-value order-details-view__detail-value--status`}>
            {order.status || 'N/A'}
          </dd>
        </div>
        <div className="order-details-view__detail-row">
          <dt className="order-details-view__detail-label">Total</dt>
          <dd className="order-details-view__detail-value">${Number(order.total ?? 0).toFixed(2)}</dd>
        </div>
        <div className="order-details-view__detail-row">
          <dt className="order-details-view__detail-label">Scheduled date</dt>
          <dd className="order-details-view__detail-value">{order.scheduled_date || 'N/A'}</dd>
        </div>
        <div className="order-details-view__detail-row">
          <dt className="order-details-view__detail-label">Time window</dt>
          <dd className="order-details-view__detail-value">{order.scheduled_time_window || 'N/A'}</dd>
        </div>
        <div className="order-details-view__detail-row">
          <dt className="order-details-view__detail-label">Payment method</dt>
          <dd className="order-details-view__detail-value">{order.payment_method || 'N/A'}</dd>
        </div>
      </dl>

      {/* Delivery area */}
      {hasDeliveryArea && (
        <div className="order-details-view__section glass-panel">
          <h3 className="order-details-view__section-title">Delivery area</h3>
          {order.delivery_area && <p className="order-details-view__section-text">{order.delivery_area}</p>}
          {order.delivery_address && <p className="order-details-view__section-text">{order.delivery_address}</p>}
        </div>
      )}

      {/* Customer / Delivery summary */}
      {hasCustomerInfo && (
        <div className="order-details-view__section glass-panel">
          <h3 className="order-details-view__section-title">Delivery summary</h3>
          {order.customer_name && <p className="order-details-view__section-text"><span className="order-details-view__bold">Name:</span> {order.customer_name}</p>}
          {order.customer_phone && <p className="order-details-view__section-text"><span className="order-details-view__bold">Phone:</span> {order.customer_phone}</p>}
          {order.customer_email && <p className="order-details-view__section-text"><span className="order-details-view__bold">Email:</span> {order.customer_email}</p>}
        </div>
      )}

      {/* Item summary */}
      {hasItems && (
        <div className="order-details-view__section glass-panel">
          <h3 className="order-details-view__section-title">Items in this order</h3>
          <ul className="order-details-view__items-list">
            {items.map((item, idx) => (
              <li key={idx} className="order-details-view__item-row">
                <span className="order-details-view__item-name">{item.name || 'Unknown'}</span>
                <span className="order-details-view__item-qty">x{item.quantity ?? 1}</span>
                <span className="order-details-view__item-price">${Number(item.price ?? 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Product positioning + legal */}
      <div className="order-details-view__positioning glass-panel">
        <p className="order-details-view__position-text">Your cocktail box is prepared cold, sealed, and ready to serve.</p>
        <p className="order-details-view__legal-reminder">Physical ID may be required at delivery.</p>
      </div>

      {/* Actions */}
      <div className="order-details-view__actions">
        <button className="secondary-link-btn" onClick={() => navigate('/')}>
          Return to catalog
        </button>
        <button className="secondary-link-btn" onClick={() => {
          const code = order.order_code
          if (code) navigate(`/orders/${code}`)
          else navigate('/account')
        }}>
          Track order
        </button>
      </div>

      {/* Backend limitation note */}
      <div className="order-details-view__note glass-panel">
        <p className="order-details-view__note-text">
          Note: This screen shows the most recent in-memory order data. True persistent customer order details require a public/customer order details endpoint or authenticated account order history.
        </p>
      </div>
    </div>
  )
}
