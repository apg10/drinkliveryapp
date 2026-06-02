import { useState, useEffect } from 'react'
import { getPublicOrderStatus } from '../api.js'

const TENANT_SLUG = 'drinklivery-panama'

export default function OrderTracking({ orderCode, onBackToCatalog }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  function resetState() {
    setData(null)
    setError(null)
    setNotFound(false)
    setLoading(true)
  }

  function handleCancel() {
    resetState()
    if (onBackToCatalog) onBackToCatalog()
  }

  function handleTrack(code) {
    resetState()
    setLoading(true)
    getPublicOrderStatus(TENANT_SLUG, code)
      .then(res => {
        if (res?.error) {
          setNotFound(true)
        } else {
          setData(res)
        }
        setLoading(false)
      })
      .catch(err => {
        const msg = err?.message || 'Unable to load order status.'
        if (err?.status === 404 || /not found/i.test(msg)) {
          setNotFound(true)
        } else {
          setError(msg)
        }
        setLoading(false)
      })
  }

  useEffect(() => {
    if (orderCode) {
      handleTrack(orderCode)
    } else {
      setLoading(false)
      setError('No order code provided.')
    }
  }, [orderCode])

  if (loading) {
    return (
      <div className="order-tracking">
        <div className="order-tracking__header">
          <button
            className="order-tracking__back-btn"
            onClick={handleCancel}
            aria-label="Back to catalog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="order-tracking__title">Drinklivery</h1>
          <div className="order-tracking__spare" />
        </div>

        <div className="order-tracking__body">
          <div className="order-tracking__hero glass-panel">
            <div className="order-tracking__icon-wrap">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <h2 className="order-tracking__hero-title">Loading order status</h2>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="order-tracking">
        <div className="order-tracking__header">
          <button
            className="order-tracking__back-btn"
            onClick={handleCancel}
            aria-label="Back to catalog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="order-tracking__title">Drinklivery</h1>
          <div className="order-tracking__spare" />
        </div>

        <div className="order-tracking__body">
          <div className="order-tracking__hero glass-panel">
            <div className="order-tracking__icon-wrap">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h2 className="order-tracking__hero-title">Order not found</h2>
            <p className="order-tracking__hero-text">
              We could not find an order with the code <strong>{orderCode}</strong>. Check the code and try again.
            </p>
          </div>

          <div className="order-tracking__actions">
            {orderCode && (
              <button
                className="order-tracking__retry-btn"
                onClick={() => handleTrack(orderCode)}
              >
                Retry
              </button>
            )}
            <button
              className="order-tracking__catalog-btn"
              onClick={onBackToCatalog}
            >
              Return to catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-tracking">
        <div className="order-tracking__header">
          <button
            className="order-tracking__back-btn"
            onClick={handleCancel}
            aria-label="Back to catalog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="order-tracking__title">Drinklivery</h1>
          <div className="order-tracking__spare" />
        </div>

        <div className="order-tracking__body">
          <div className="order-tracking__hero glass-panel">
            <div className="order-tracking__icon-wrap">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h2 className="order-tracking__hero-title">Unable to load status</h2>
            <p className="order-tracking__hero-text">{error}</p>
          </div>

          <div className="order-tracking__actions">
            <button
              className="order-tracking__retry-btn"
              onClick={() => orderCode && handleTrack(orderCode)}
            >
              Retry
            </button>
            <button
              className="order-tracking__catalog-btn"
              onClick={onBackToCatalog}
            >
              Return to catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (data) {
    return (
      <div className="order-tracking">
        <div className="order-tracking__header">
          <button
            className="order-tracking__back-btn"
            onClick={handleCancel}
            aria-label="Back to catalog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="order-tracking__title">Drinklivery</h1>
          <div className="order-tracking__spare" />
        </div>

        <div className="order-tracking__body">
          <div className="order-tracking__hero glass-panel">
            <div className="order-tracking__icon-wrap">
              {data.status === 'DELIVERED' ? (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                  <line x1="11" y1="7" x2="11" y2="11"/>
                  <line x1="7" y1="11" x2="11" y2="11"/>
                </svg>
              )}
            </div>
            <h2 className="order-tracking__hero-title">Order Status</h2>
            <p className="order-tracking__hero-text">
              Your order is currently <strong>{data.status}</strong>.
            </p>
            <div className="order-tracking__code-section">
              <span className="order-tracking__code-label">Order number</span>
              <span className="order-tracking__code-value">{data.order_code}</span>
            </div>
          </div>

          <dl className="order-tracking__details">
            <div className="order-tracking__detail-row">
              <dt className="order-tracking__detail-label">Status</dt>
              <dd className="order-tracking__detail-value">{data.status}</dd>
            </div>
            <div className="order-tracking__detail-row">
              <dt className="order-tracking__detail-label">Scheduled date</dt>
              <dd className="order-tracking__detail-value">{data.scheduled_date || 'N/A'}</dd>
            </div>
            <div className="order-tracking__detail-row">
              <dt className="order-tracking__detail-label">Time window</dt>
              <dd className="order-tracking__detail-value">{data.scheduled_time_window || 'N/A'}</dd>
            </div>
            <div className="order-tracking__detail-row">
              <dt className="order-tracking__detail-label">Total</dt>
              <dd className="order-tracking__detail-value">${Number(data.total ?? 0).toFixed(2)}</dd>
            </div>
          </dl>

          <div className="order-tracking__actions">
            <button
              className="order-tracking__catalog-btn"
              onClick={onBackToCatalog}
            >
              Return to catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
