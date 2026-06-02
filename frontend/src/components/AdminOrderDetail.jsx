import { useEffect, useState } from 'react'
import { getAdminOrder, updateAdminOrderStatus, updateAdminOrderPayment, submitAdminDeliveryVerification } from '../api'

function formatMoney(value) {
  return `$${Number(value ?? 0).toFixed(2)}`
}

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function DetailRow({ label, value }) {
  return (
    <div className="admin-detail__row">
      <dt>{label}</dt>
      <dd>{value || 'N/A'}</dd>
    </div>
  )
}

export default function AdminOrderDetail({ orderId, onBackToList, onBackToCatalog }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  // Status update form state
  const [statusForm, setStatusForm] = useState({ status: 'PENDING', note: '' })
  const [statusAction, setStatusAction] = useState({ submitting: false, error: null, success: null })

  // Payment update form state
  const [paymentForm, setPaymentForm] = useState({ method: 'CASH', status: 'PENDING', amount: '', reference: '', notes: '' })
  const [paymentAction, setPaymentAction] = useState({ submitting: false, error: null, success: null })

  // Delivery verification form state
  const [verificationForm, setVerificationForm] = useState({ receiver_name: '', receiver_document_checked: 'true', receiver_is_adult: 'true', verification_notes: '' })
  const [verificationAction, setVerificationAction] = useState({ submitting: false, error: null, success: null })

  async function handleStatusSubmit(e) {
    e.preventDefault()
    setStatusAction({ submitting: true, error: null, success: null })
    try {
      await updateAdminOrderStatus(order.id, { status: statusForm.status, note: statusForm.note || undefined })
      setStatusAction({ submitting: false, error: null, success: 'Status updated successfully.' })
      setError(null)
      await loadOrder()
    } catch (err) {
      setStatusAction({ submitting: false, error: err?.message || 'Failed to update status.', success: null })
    }
  }

  async function handlePaymentSubmit(e) {
    e.preventDefault()
    setPaymentAction({ submitting: true, error: null, success: null })
    try {
      const payload = {
        method: paymentForm.method,
        status: paymentForm.status,
        amount: paymentForm.amount,
      }
      if (paymentForm.reference) payload.reference = paymentForm.reference
      if (paymentForm.notes) payload.notes = paymentForm.notes
      await updateAdminOrderPayment(order.id, payload)
      setPaymentAction({ submitting: false, error: null, success: 'Payment recorded successfully.' })
      setError(null)
      await loadOrder()
    } catch (err) {
      setPaymentAction({ submitting: false, error: err?.message || 'Failed to record payment.', success: null })
    }
  }

  async function handleVerificationSubmit(e) {
    e.preventDefault()
    setVerificationAction({ submitting: true, error: null, success: null })
    try {
      await submitAdminDeliveryVerification(order.id, {
        receiver_name: verificationForm.receiver_name,
        receiver_document_checked: verificationForm.receiver_document_checked === 'true',
        receiver_is_adult: verificationForm.receiver_is_adult === 'true',
        verification_notes: verificationForm.verification_notes || undefined,
      })
      setVerificationAction({ submitting: false, error: null, success: 'Delivery verification submitted successfully.' })
      setError(null)
      await loadOrder()
    } catch (err) {
      setVerificationAction({ submitting: false, error: err?.message || 'Failed to submit verification.', success: null })
    }
  }

  async function loadOrder() {
    if (!orderId) {
      setLoading(false)
      setNotFound(true)
      return
    }

    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const data = await getAdminOrder(orderId)
      setOrder(data)
      setStatusForm(prev => ({ ...prev, status: data.status || 'PENDING' }))
      setPaymentForm(prev => ({
        ...prev,
        method: data.payment_method || 'CASH',
        status: data.payment_status || 'PENDING',
        amount: data.total ?? '',
      }))
    } catch (err) {
      if (err?.status === 404) {
        setNotFound(true)
      } else if (err?.status === 401 || err?.status === 403) {
        setError('Admin access is required. Use an authenticated admin backend session to view order details.')
      } else {
        setError(err?.message || 'Unable to load order detail.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [orderId])

  return (
    <div className="admin-detail">
      <header className="admin-detail__topbar">
        <button className="admin-detail__back" onClick={onBackToList} aria-label="Back to admin orders">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <p className="admin-detail__eyebrow">Admin MVP</p>
          <h1 className="admin-detail__title">Order Detail</h1>
        </div>
        <button className="admin-detail__catalog" onClick={onBackToCatalog}>Catalog</button>
      </header>

      <main className="admin-detail__body">
        {loading && (
          <div className="admin-detail__state glass-panel" role="status">
            Loading order detail...
          </div>
        )}

        {!loading && notFound && (
          <div className="admin-detail__state admin-detail__state--error glass-panel" role="alert">
            <strong>Order not found</strong>
            <span>The selected admin order could not be found.</span>
            <button className="admin-detail__state-btn" onClick={onBackToList}>Back to list</button>
          </div>
        )}

        {!loading && error && (
          <div className="admin-detail__state admin-detail__state--error glass-panel" role="alert">
            <strong>Unable to load order</strong>
            <span>{error}</span>
            <button className="admin-detail__state-btn" onClick={loadOrder}>Try again</button>
          </div>
        )}

        {!loading && !error && !notFound && order && (
          <>
            <section className="admin-detail__hero glass-panel">
              <div>
                <p className="admin-detail__eyebrow">{order.order_code}</p>
                <h2 className="admin-detail__hero-title">{order.customer?.full_name || 'Unknown customer'}</h2>
                <p className="admin-detail__hero-text">
                  {order.address?.city || 'N/A'} · {order.scheduled_date || 'N/A'} · {order.scheduled_time_window || 'N/A'}
                </p>
              </div>
              <p className="admin-detail__total">{formatMoney(order.total)}</p>
            </section>

            <section className="admin-detail__grid">
              <div className="admin-detail__panel glass-panel">
                <h3 className="admin-detail__panel-title">Status</h3>
                <dl className="admin-detail__rows">
                  <DetailRow label="Order status" value={order.status} />
                  <DetailRow label="Payment status" value={order.payment_status} />
                  <DetailRow label="Payment method" value={order.payment_method} />
                  <DetailRow label="Created" value={formatDateTime(order.created_at)} />
                </dl>
              </div>

              <div className="admin-detail__panel glass-panel">
                <h3 className="admin-detail__panel-title">Customer</h3>
                <dl className="admin-detail__rows">
                  <DetailRow label="Name" value={order.customer?.full_name} />
                  <DetailRow label="Phone" value={order.customer?.phone} />
                  <DetailRow label="Email" value={order.customer?.email} />
                </dl>
              </div>

              <div className="admin-detail__panel glass-panel">
                <h3 className="admin-detail__panel-title">Address</h3>
                <dl className="admin-detail__rows">
                  <DetailRow label="Address" value={order.address?.address_line} />
                  <DetailRow label="Building" value={order.address?.building_details} />
                  <DetailRow label="City" value={order.address?.city} />
                  <DetailRow label="Delivery notes" value={order.address?.delivery_notes} />
                </dl>
              </div>

              <div className="admin-detail__panel glass-panel">
                <h3 className="admin-detail__panel-title">Totals</h3>
                <dl className="admin-detail__rows">
                  <DetailRow label="Subtotal" value={formatMoney(order.subtotal)} />
                  <DetailRow label="Delivery fee" value={formatMoney(order.delivery_fee)} />
                  <DetailRow label="Total" value={formatMoney(order.total)} />
                </dl>
              </div>
            </section>

            <section className="admin-detail__panel admin-detail__panel--items glass-panel">
              <h3 className="admin-detail__panel-title">Items</h3>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                <div className="admin-detail__items">
                  {order.items.map(item => (
                    <div key={item.id} className="admin-detail-item">
                      <div>
                        <p className="admin-detail-item__name">{item.product_name}</p>
                        <p className="admin-detail-item__meta">{item.variant_name || 'Default'} · Qty {item.quantity}</p>
                      </div>
                      <div className="admin-detail-item__prices">
                        <span>{formatMoney(item.unit_price)}</span>
                        <strong>{formatMoney(item.total_price)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-detail__empty-items">No items found.</p>
              )}
            </section>

            {/* Status Update Form */}
            <AdminActionPanel title="Update Status" error={statusAction.error} success={statusAction.success} submitting={statusAction.submitting}>
              <form className="admin-action__form" onSubmit={handleStatusSubmit}>
                <fieldset className="admin-action__fieldset">
                  <legend className="admin-action__legend">Order Status</legend>
                  <div className="admin-action__field">
                    <label className="admin-action__label" htmlFor="status-update-status">New Status</label>
                    <select
                      id="status-update-status"
                      className="admin-action__select"
                      value={statusForm.status}
                      onChange={e => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="IN_PREPARATION">IN_PREPARATION</option>
                      <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="FAILED_AGE_VERIFICATION">FAILED_AGE_VERIFICATION</option>
                    </select>
                  </div>
                  <div className="admin-action__field">
                    <label className="admin-action__label" htmlFor="status-update-note">Note (optional)</label>
                    <textarea
                      id="status-update-note"
                      className="admin-action__textarea"
                      rows={2}
                      placeholder="Optional note for the status change"
                      value={statusForm.note}
                      onChange={e => setStatusForm(prev => ({ ...prev, note: e.target.value }))}
                    />
                  </div>
                </fieldset>
                <button className="admin-action__btn" type="submit" disabled={statusAction.submitting}>
                  {statusAction.submitting ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </AdminActionPanel>

            {/* Payment Update Form */}
            <AdminActionPanel title="Record Payment" error={paymentAction.error} success={paymentAction.success} submitting={paymentAction.submitting}>
              <form className="admin-action__form" onSubmit={handlePaymentSubmit}>
                <fieldset className="admin-action__fieldset">
                  <legend className="admin-action__legend">Payment Details</legend>
                  <div className="admin-action__grid">
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="payment-method">Method</label>
                      <select
                        id="payment-method"
                        className="admin-action__select"
                        value={paymentForm.method}
                        onChange={e => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
                      >
                        <option value="CASH">CASH</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="YAPPY_MANUAL">YAPPY_MANUAL</option>
                        <option value="OTHER_MANUAL">OTHER_MANUAL</option>
                      </select>
                    </div>
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="payment-status">Payment Status</label>
                      <select
                        id="payment-status"
                        className="admin-action__select"
                        value={paymentForm.status}
                        onChange={e => setPaymentForm(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-action__grid">
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="payment-amount">Amount</label>
                      <input
                        id="payment-amount"
                        type="number"
                        step="0.01"
                        required
                        className="admin-action__input"
                        placeholder="0.00"
                        value={paymentForm.amount}
                        onChange={e => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="payment-reference">Reference</label>
                      <input
                        id="payment-reference"
                        type="text"
                        className="admin-action__input"
                        placeholder="Optional reference"
                        value={paymentForm.reference}
                        onChange={e => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="admin-action__field">
                    <label className="admin-action__label" htmlFor="payment-notes">Notes (optional)</label>
                    <textarea
                      id="payment-notes"
                      className="admin-action__textarea"
                      rows={2}
                      placeholder="Optional payment notes"
                      value={paymentForm.notes}
                      onChange={e => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </fieldset>
                <button className="admin-action__btn" type="submit" disabled={paymentAction.submitting}>
                  {paymentAction.submitting ? 'Recording...' : 'Record Payment'}
                </button>
              </form>
            </AdminActionPanel>

            {/* Delivery Verification Form */}
            <AdminActionPanel title="Delivery Verification" error={verificationAction.error} success={verificationAction.success} submitting={verificationAction.submitting}>
              <p className="admin-action__compliance-notice">
                Physical ID is checked at delivery but not stored. Do not enter ID numbers or upload images.
              </p>
              <form className="admin-action__form" onSubmit={handleVerificationSubmit}>
                <fieldset className="admin-action__fieldset">
                  <legend className="admin-action__legend">Receiver Confirmation</legend>
                  <div className="admin-action__field">
                    <label className="admin-action__label" htmlFor="verification-receiver">Receiver Name</label>
                    <input
                      id="verification-receiver"
                      type="text"
                      required
                      className="admin-action__input"
                      placeholder="Name of the person who received the order"
                      value={verificationForm.receiver_name}
                      onChange={e => setVerificationForm(prev => ({ ...prev, receiver_name: e.target.value }))}
                    />
                  </div>
                  <div className="admin-action__grid">
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="verification-document">Document Checked</label>
                      <select
                        id="verification-document"
                        className="admin-action__select"
                        value={verificationForm.receiver_document_checked}
                        onChange={e => setVerificationForm(prev => ({ ...prev, receiver_document_checked: e.target.value }))}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="admin-action__field">
                      <label className="admin-action__label" htmlFor="verification-adult">Receiver is Adult</label>
                      <select
                        id="verification-adult"
                        className="admin-action__select"
                        value={verificationForm.receiver_is_adult}
                        onChange={e => setVerificationForm(prev => ({ ...prev, receiver_is_adult: e.target.value }))}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-action__field">
                    <label className="admin-action__label" htmlFor="verification-notes">Verification Notes (optional)</label>
                    <textarea
                      id="verification-notes"
                      className="admin-action__textarea"
                      rows={2}
                      placeholder="Optional verification notes"
                      value={verificationForm.verification_notes}
                      onChange={e => setVerificationForm(prev => ({ ...prev, verification_notes: e.target.value }))}
                    />
                  </div>
                </fieldset>
                <button className="admin-action__btn" type="submit" disabled={verificationAction.submitting}>
                  {verificationAction.submitting ? 'Submitting...' : 'Submit Verification'}
                </button>
              </form>
            </AdminActionPanel>
          </>
        )}
      </main>
    </div>
  )
}

function AdminActionPanel({ title, error, success, submitting, children }) {
  return (
    <section className="admin-detail__panel admin-action-panel glass-panel">
      <h3 className="admin-detail__panel-title admin-action-panel__title">{title}</h3>
      {success && (
        <div className="admin-action__feedback admin-action__feedback--success" role="status">
          {success}
        </div>
      )}
      {error && (
        <div className="admin-action__feedback admin-action__feedback--error" role="alert">
          {error}
        </div>
      )}
      {children}
    </section>
  )}
