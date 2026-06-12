import { useState, useEffect, useMemo } from 'react'
import { getPublicOrderStatus } from '../api.js'

const TENANT_SLUG = 'drinklivery-panama'

// Known public status lifecycle (order matters)
const STATUS_LIFECYCLE = [
  { key: 'PENDING', label: 'Order received', iconType: 'received' },
  { key: 'ACCEPTED', label: 'Accepted', iconType: 'accepted' },
  { key: 'IN_PREPARATION', label: 'Preparing', iconType: 'preparing' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for delivery', iconType: 'ready' },
  { key: 'OUT_FOR_DELIVERY', label: "Out for delivery", iconType: 'outForDelivery' },
  { key: 'DELIVERED', label: 'Delivered', iconType: 'delivered' },
]

const TERMINAL_NEGATIVE = ['CANCELLED', 'REJECTED', 'FAILED_AGE_VERIFICATION']

function renderLifecycleIcon(iconType) {
  switch (iconType) {
    case 'received':
      return <><path d="M21.44 11.05L9 20.36a.75.75 0 0 1-1.12-.82l2.96-9.6H3a.75.75 0 0 1-.75-.75V4a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 .75.75v5.5z" /><path d="M9 12l6 6" /></>
    case 'accepted':
      return <><polyline points="13 17 18 12 23 17" /><polyline points="10 6 4 12 10 18" /></>
    case 'preparing':
      return <><path d="M12 2v6" /><path d="m9 5 3-3 3 3" /><circle cx="12" cy="20" r="5" /><path d="M8 21h8" /></>
    case 'ready':
      return <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="12" y1="2" x2="12" y2="6" /><polyline points="8 14 10 16 14 12" /></>
    case 'outForDelivery':
      return <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 11" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="15.5" cy="18.5" r="2.5" /></>
    case 'delivered':
      return <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
    default:
      return null
  }
}

function renderTerminalIcon(status) {
  if (status === 'FAILED_AGE_VERIFICATION') {
    return <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><circle cx="12" cy="17" r=".5" /></>
  }
  return <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>
}

function renderHeroIcon(status) {
  if (status === 'DELIVERED') {
    return <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
  }
  if (TERMINAL_NEGATIVE.includes(status)) {
    return renderTerminalIcon(status)
  }
  return <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>
}

function getStatusStep(currentStatus, targetStatus) {
  if (TERMINAL_NEGATIVE.includes(currentStatus)) {
    const idx = STATUS_LIFECYCLE.findIndex(s => s.key === currentStatus)
    if (idx !== -1) return idx
    return -1
  }
  const currentIdx = STATUS_LIFECYCLE.findIndex(s => s.key === currentStatus)
  if (currentIdx === -1) return -1
  const targetIdx = STATUS_LIFECYCLE.findIndex(s => s.key === targetStatus)
  return targetIdx <= currentIdx ? (targetIdx < 0 ? -1 : currentIdx + 1) : (-1)
}

function getTimelineSteps(currentStatus) {
  // Check if this is a known lifecycle status before proceeding
  const currentIndex = STATUS_LIFECYCLE.findIndex(s => s.key === currentStatus)

  // If status is unknown (not in STATUS_LIFECYCLE and not terminal negative), return null
  if (currentIndex === -1 && !TERMINAL_NEGATIVE.includes(currentStatus)) {
    return null
  }

  const steps = []

  if (TERMINAL_NEGATIVE.includes(currentStatus)) {
    // For negative statuses, show all lifecycle items with a stopped state
    for (let i = 0; i < STATUS_LIFECYCLE.length; i++) {
      const step = STATUS_LIFECYCLE[i]
      if (i <= currentIndex) {
        steps.push({ ...step, state: 'completed' })
      } else {
        steps.push({ ...step, state: 'cancelled' })
      }
    }
    steps.push({ key: currentStatus, label: getStatusLabel(currentStatus), iconType: null, state: 'current-negative', isSelf: true })
    return steps
  }

  for (let i = 0; i < STATUS_LIFECYCLE.length; i++) {
    const step = STATUS_LIFECYCLE[i]
    if (i < currentIndex) {
      steps.push({ ...step, state: 'completed' })
    } else if (i === currentIndex) {
      steps.push({ ...step, state: 'current', isSelf: true })
    } else if (i === currentIndex + 1 && currentStatus !== 'DELIVERED') {
      steps.push({ ...step, state: 'upcoming' })
    }
  }

  return steps
}

function getStatusLabel(status) {
  switch (status) {
    case 'CANCELLED': return 'Order cancelled'
    case 'REJECTED': return 'Order rejected'
    case 'FAILED_AGE_VERIFICATION': return 'Age verification failed'
    default: return status
  }
}

export default function OrderTracking({ orderCode, onBackToCatalog, onViewDetails }) {
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

  const timeline = useMemo(() => {
    return data ? getTimelineSteps(data.status) : null
  }, [data])

  const isTerminalNegative = data ? TERMINAL_NEGATIVE.includes(data.status) : false
  const isDelivered = data?.status === 'DELIVERED'
  const isAlcoholic = false // Not exposed by public status endpoint; skip compliance display

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
          <div className="order-tracking__hero glass-panel order-tracking__hero--error">
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
            {onViewDetails && (
              <button
                className="order-tracking__details-btn order-tracking__catalog-btn"
                onClick={onViewDetails}
              >
                Order details
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
          <div className="order-tracking__hero glass-panel order-tracking__hero--error">
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
            {onViewDetails && (
              <button
                className="order-tracking__details-btn order-tracking__catalog-btn"
                onClick={onViewDetails}
              >
                Order details
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
          <div className={`order-tracking__hero glass-panel ${isDelivered ? 'order-tracking__hero--success' : isTerminalNegative ? 'order-tracking__hero--error' : ''}`}>
            <div className="order-tracking__icon-wrap">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={isDelivered ? 'var(--secondary)' : isTerminalNegative ? 'var(--error)' : 'var(--tertiary)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {renderHeroIcon(data.status)}
              </svg>
            </div>
            <h2 className="order-tracking__hero-title">{isTerminalNegative ? getStatusLabel(data.status) : 'Order Status'}</h2>
            {isTerminalNegative ? (
              <p className="order-tracking__hero-text order-tracking__hero-text--warning">
                This order has ended. No further delivery will occur.
              </p>
            ) : isDelivered ? (
              <p className="order-tracking__hero-text">
                Your order has been delivered successfully. Thank you!
              </p>
            ) : (
              <p className="order-tracking__hero-text">
                Your order is currently <strong>{data.status}</strong>.
              </p>
            )}
            <div className="order-tracking__code-section">
              <span className="order-tracking__code-label">Order number</span>
              <span className="order-tracking__code-value">{data.order_code}</span>
            </div>
          </div>

          {timeline && (
            <div className="order-tracking__timeline glass-panel" role="list" aria-label="Order timeline">
              {timeline.map((step, idx) => {
                const hasIcon = step.iconType !== null && !TERMINAL_NEGATIVE.includes(step.key)
                const isTerminalStep = TERMINAL_NEGATIVE.includes(step.key)
                return (
                  <div key={idx} className={`order-tracking__timeline-step order-tracking__timeline-step--${step.state}`} role="listitem">
                    <div className="order-tracking__timeline-marker">
                      {isTerminalStep ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          {renderTerminalIcon(step.key)}
                        </svg>
                      ) : hasIcon ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={
                          step.state === 'current' ? 'var(--primary-container)' :
                          step.state === 'completed' ? 'var(--secondary)' :
                          step.state === 'cancelled' ? 'var(--on-surface-variant)' :
                          'var(--on-surface-variant)'
                        } strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          {renderLifecycleIcon(step.iconType)}
                        </svg>
                      ) : (
                        <span className={`order-tracking__timeline-dot order-tracking__timeline-dot--${step.state}`} />
                      )}
                    </div>
                    {idx < timeline.length - 1 && (
                      <div className={`order-tracking__timeline-line ${
                        step.state === 'completed' ? 'order-tracking__timeline-line--completed' :
                        step.state === 'current-negative' ? 'order-tracking__timeline-line--cancelled' :
                        ''
                      }`} />
                    )}
                    <div className="order-tracking__timeline-content">
                      <span className={`order-tracking__timeline-label ${step.isSelf ? 'order-tracking__timeline-label--active' : ''}`}>
                        {step.label}
                      </span>
                      {step.state === 'upcoming' && (
                        <span className="order-tracking__timeline-upcoming-tag">Upcoming</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <dl className="order-tracking__details">
            <div className="order-tracking__detail-row">
              <dt className="order-tracking__detail-label">Status</dt>
              <dd className="order-tracking__detail-value order-tracking__detail-value--status">{data.status}</dd>
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

          {!isTerminalNegative && !isDelivered && (
            <div className="order-tracking__guidance glass-panel">
               <p className="order-tracking__guidance-text">
                Please have your order code ready and ensure the receiver is available at the scheduled delivery time. Present valid physical ID upon arrival for alcoholic orders.
              </p>
            </div>
          )}

          {!isTerminalNegative && !isDelivered && (
            <div className="order-tracking__gps-fallback glass-panel">
              <p className="order-tracking__gps-fallback-text">
                Live driver GPS is not available yet. We will keep this status updated.
              </p>
            </div>
          )}

          {!isTerminalNegative && !isDelivered && (
            <div className="order-tracking__id-reminder glass-panel">
              <p className="order-tracking__id-reminder-text">
                Physical ID may be required at delivery. Please ensure the receiver is available to present valid identification.
              </p>
            </div>
          )}

          <div className="order-tracking__actions">
            <button
              className="order-tracking__retry-btn"
              onClick={() => orderCode && handleTrack(orderCode)}
            >
              Refresh status
            </button>
            {onViewDetails && (
              <button
                className="order-tracking__details-btn order-tracking__catalog-btn"
                onClick={onViewDetails}
              >
                Order details
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

  return null
}
