export default function OrderConfirmation({ order, onReturnToCatalog, onTrackOrder }) {
  return (
    <div className="order-confirmation">
      <div className="order-confirmation__header">
        <button
          className="order-confirmation__back-btn"
          onClick={onReturnToCatalog}
          aria-label="Back to catalog"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="order-confirmation__title">Drinklivery</h1>
        <div className="order-confirmation__spare" />
      </div>

      <div className="order-confirmation__body">
        <div className="order-confirmation__hero glass-panel">
          <div className="order-confirmation__icon-wrap">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="order-confirmation__hero-title">Order placed</h2>
          <p className="order-confirmation__hero-text">Your order has been received and is pending confirmation.</p>

          <div className="order-confirmation__code-section">
            <span className="order-confirmation__code-label">Order number</span>
            <span className="order-confirmation__code-value">{order?.order_code || 'N/A'}</span>
          </div>
        </div>

        <dl className="order-confirmation__details">
          <div className="order-confirmation__detail-row">
            <dt className="order-confirmation__detail-label">Status</dt>
            <dd className="order-confirmation__detail-value">{order?.status || 'N/A'}</dd>
          </div>
          <div className="order-confirmation__detail-row">
            <dt className="order-confirmation__detail-label">Total</dt>
            <dd className="order-confirmation__detail-value">${Number(order?.total ?? 0).toFixed(2)}</dd>
          </div>
          <div className="order-confirmation__detail-row">
            <dt className="order-confirmation__detail-label">Scheduled date</dt>
            <dd className="order-confirmation__detail-value">{order?.scheduled_date || 'N/A'}</dd>
          </div>
          <div className="order-confirmation__detail-row">
            <dt className="order-confirmation__detail-label">Time window</dt>
            <dd className="order-confirmation__detail-value">{order?.scheduled_time_window || 'N/A'}</dd>
          </div>
          <div className="order-confirmation__detail-row">
            <dt className="order-confirmation__detail-label">Payment method</dt>
            <dd className="order-confirmation__detail-value">{order?.payment_method || 'N/A'}</dd>
          </div>
        </dl>

        <div className="order-confirmation__tracking-note glass-panel">
          <span className="order-confirmation__tracking-icon">!</span>
          <p className="order-confirmation__tracking-text">
            Track your order status in real time.
          </p>
        </div>

        <button className="order-confirmation__track-btn" onClick={onTrackOrder}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          Track order
        </button>

        <button className="order-confirmation__back-to-catalog" onClick={onReturnToCatalog}>
          Return to catalog
        </button>
      </div>
    </div>
  )
}
