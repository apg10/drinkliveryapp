import { useEffect, useState } from 'react'
import { getAdminDashboardSummary, getAdminOrders } from '../api'

function formatMoney(value) {
  return `$${Number(value ?? 0).toFixed(2)}`
}

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function AdminOrders({ onBackToCatalog, onOpenOrder }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  function loadOrders() {
    setLoading(true)
    setError(null)
    getAdminOrders()
      .then(data => {
        setOrders(Array.isArray(data?.orders) ? data.orders : [])
      })
      .catch(err => {
        if (err?.status === 401 || err?.status === 403) {
          setError('Admin access is required. Use an authenticated admin backend session to view orders.')
        } else {
          setError(err?.message || 'Unable to load admin orders.')
        }
      })
      .finally(() => setLoading(false))
  }

  function loadSummary() {
    setSummaryLoading(true)
    setSummaryError(null)
    getAdminDashboardSummary()
      .then(data => setSummary(data))
      .catch(err => {
        if (err?.status === 401 || err?.status === 403) {
          setSummaryError('Admin access is required for dashboard metrics.')
        } else {
          setSummaryError(err?.message || 'Unable to load dashboard summary.')
        }
      })
      .finally(() => setSummaryLoading(false))
  }

  useEffect(() => {
    loadOrders()
    loadSummary()
  }, [])

  return (
    <div className="admin-orders">
      <header className="admin-orders__topbar">
        <button className="admin-orders__back" onClick={onBackToCatalog} aria-label="Back to catalog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <p className="admin-orders__eyebrow">Admin MVP</p>
          <h1 className="admin-orders__title">Orders</h1>
        </div>
        <button className="admin-orders__refresh" onClick={loadOrders} disabled={loading}>
          {loading ? 'Loading' : 'Refresh'}
        </button>
      </header>

      <main className="admin-orders__body">
        <section className="admin-orders__hero glass-panel">
          <div>
            <p className="admin-orders__eyebrow">Operations</p>
            <h2 className="admin-orders__hero-title">Live order queue</h2>
            <p className="admin-orders__hero-text">
              Read-only admin list from the backend. Authentication is handled by the backend session.
            </p>
          </div>
          <span className="admin-orders__count">{orders.length} orders</span>
        </section>

        <section className="admin-summary glass-panel" aria-label="Admin dashboard summary">
          <div className="admin-summary__header">
            <div>
              <p className="admin-orders__eyebrow">Dashboard</p>
              <h2 className="admin-summary__title">Summary</h2>
            </div>
            <button className="admin-summary__refresh" onClick={loadSummary} disabled={summaryLoading}>
              {summaryLoading ? 'Loading' : 'Refresh summary'}
            </button>
          </div>

          {summaryLoading && (
            <p className="admin-summary__state" role="status">Loading dashboard summary...</p>
          )}

          {!summaryLoading && summaryError && (
            <p className="admin-summary__state admin-summary__state--error" role="alert">{summaryError}</p>
          )}

          {!summaryLoading && !summaryError && summary && (
            <>
              <div className="admin-summary__cards">
                <div className="admin-summary-card">
                  <span>Total orders</span>
                  <strong>{summary.total_orders ?? 0}</strong>
                </div>
                <div className="admin-summary-card">
                  <span>Pending orders</span>
                  <strong>{summary.pending_orders ?? 0}</strong>
                </div>
                <div className="admin-summary-card">
                  <span>Confirmed revenue</span>
                  <strong>{formatMoney(summary.confirmed_revenue)}</strong>
                </div>
              </div>

              {summary.orders_by_status && (
                <div className="admin-summary__statuses">
                  {Object.entries(summary.orders_by_status).map(([status, count]) => (
                    <span key={status} className="admin-summary__status-chip">
                      {status}: {count}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {loading && (
          <div className="admin-orders__state glass-panel" role="status">
            Loading admin orders...
          </div>
        )}

        {!loading && error && (
          <div className="admin-orders__state admin-orders__state--error glass-panel" role="alert">
            <strong>Unable to load orders</strong>
            <span>{error}</span>
            <button className="admin-orders__state-btn" onClick={loadOrders}>Try again</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="admin-orders__state glass-panel">
            No orders yet.
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="admin-orders__list">
            {orders.map(order => (
              <article key={order.id} className="admin-order-card glass-panel">
                <div className="admin-order-card__header">
                  <div>
                    <p className="admin-order-card__code">{order.order_code}</p>
                    <p className="admin-order-card__customer">{order.customer?.full_name || 'Unknown customer'}</p>
                  </div>
                  <p className="admin-order-card__total">{formatMoney(order.total)}</p>
                </div>

                <div className="admin-order-card__chips">
                  <span className="admin-order-card__chip">{order.status || 'N/A'}</span>
                  <span className="admin-order-card__chip admin-order-card__chip--payment">{order.payment_status || 'N/A'}</span>
                </div>

                <dl className="admin-order-card__details">
                  <div>
                    <dt>City</dt>
                    <dd>{order.address?.city || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt>Scheduled</dt>
                    <dd>{order.scheduled_date || 'N/A'} · {order.scheduled_time_window || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{formatDateTime(order.created_at)}</dd>
                  </div>
                </dl>

                <button className="admin-order-card__detail-btn" onClick={() => onOpenOrder(order.id)}>
                  View details
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
