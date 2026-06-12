export default function OrderConfirmation({ order, onReturnToCatalog, onTrackOrder, onViewDetails }) {
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
          <h2 className="order-confirmation__hero-title">Order confirmed</h2>
          <p className="order-confirmation__hero-text">Your cocktail box is confirmed. Your kit is packed cold, sealed, and ready to serve.</p>

          <div className="order-confirmation__code-section">
            <span className="order-confirmation__code-label">Order number</span>
            <span className="order-confirmation__code-value">{order?.order_code || 'N/A'}</span>
          </div>

          {order?.payment_method && !['CASH'].includes(order.payment_method) && (
            <p className="order-confirmation__payment-note">
              We will confirm payment before beginning preparation.
            </p>
          )}
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

        <div className="order-confirmation__what-next glass-panel">
            <h3 className="order-confirmation__what-next-title">What happens next</h3>
            <ol className="order-confirmation__what-next-steps">
              <li className="order-confirmation__what-next-step">
                <span className="step-number">1</span> Order received and verified
              </li>
              <li className="order-confirmation__what-next-step">
                <span className="step-number">2</span> Payment and age confirmation
              </li>
              <li className="order-confirmation__what-next-step">
                <span className="step-number">3</span> Cocktail kit prepared by our partners
              </li>
              <li className="order-confirmation__what-next-step">
                <span className="step-number">4</span> Sealed and packed cold for delivery
              </li>
              <li className="order-confirmation__what-next-step">
                <span className="step-number">5</span> Out for delivery to your address
              </li>
            </ol>
          </div>

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

        {onViewDetails && (
          <button className="order-details-view__action-btn" onClick={onViewDetails}>
            View order details
          </button>
        )}

        <button className="order-confirmation__return-btn" onClick={onReturnToCatalog}>
          Return to catalog
        </button>
      </div>
    </div>
  )
}
