import { useState, useEffect } from 'react'
import { getPublicDeliveryZones, createPublicOrder } from '../api.js'

const TENANT_SLUG = 'drinklivery-panama'

export default function CheckoutView({ cartItems, cartSubtotal, deliveryFee, onBackToCart, onBackToCatalog, onOrderCreated }) {
  const isEmpty = cartItems.length === 0
  const hasAlcoholic = cartItems.some(item => item.isAlcoholic === true)

  const [form, setForm] = useState({
    customer: { full_name: '', phone: '', email: '' },
    address: { address_line: '', building_details: '', city: '', delivery_notes: '' },
    scheduled_date: '',
    scheduled_time_window: '',
    payment_method: '',
    customer_notes: '',
    terms_accepted: false,
    age_confirmed_by_customer: false,
  })

  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const setField = (section, key, value) => setForm(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
  const setFieldRoot = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const fetchZones = () => {
    setLoading(true)
    setError(null)
    getPublicDeliveryZones(TENANT_SLUG)
      .then(res => {
        const zoneList = Array.isArray(res.zones) ? res.zones : []
        setZones(zoneList)
        if (zoneList.length > 0 && !selectedZoneId) {
          setSelectedZoneId(zoneList[0].id)
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load delivery zones')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!isEmpty) {
      fetchZones()
    }
    else {
      setZones([])
      setError(null)
      setSelectedZoneId(null)
    }
  }, [isEmpty])

  const handleRetry = () => fetchZones()

  function validateBeforeSubmit() {
    if (isEmpty) return { error: 'Cart is empty.' }
    if (!selectedZoneId) return { error: 'Please select a delivery area.' }
    if (!form.terms_accepted) return { error: 'Please accept the delivery terms to continue.' }
    if (hasAlcoholic && !form.age_confirmed_by_customer) return { error: 'Please confirm the receiver is of legal drinking age.' }
    if (!form.customer.full_name.trim()) return { error: 'Full name is required.' }
    if (!form.customer.phone.trim()) return { error: 'Phone number is required.' }
    if (!form.address.address_line.trim()) return { error: 'Address line is required.' }
    if (!form.address.city.trim()) return { error: 'City is required.' }
    if (!form.scheduled_date) return { error: 'Scheduled date is required.' }
    if (!form.scheduled_time_window.trim()) return { error: 'Time window is required.' }
    if (!form.payment_method) return { error: 'Payment method is required.' }
    return null
  }

  async function handleSubmit() {
    const validation = validateBeforeSubmit()
    if (validation) {
      setSubmitError(validation.error)
      return
    }

    if (!onOrderCreated) {
      setSubmitError('Order confirmation callback is not available.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const items = cartItems.map(item => {
      const base = { product_id: item.productId, quantity: item.quantity }
      if (item.variantId != null) {
        base.variant_id = item.variantId
      }
      return base
    })

    const payload = {
      customer: {
        full_name: form.customer.full_name,
        phone: form.customer.phone,
        email: form.customer.email,
      },
      address: {
        address_line: form.address.address_line,
        building_details: form.address.building_details,
        city: form.address.city,
        delivery_notes: form.address.delivery_notes,
      },
      delivery_zone_id: selectedZoneId,
      scheduled_date: form.scheduled_date,
      scheduled_time_window: form.scheduled_time_window,
      payment_method: form.payment_method,
      customer_notes: form.customer_notes,
      age_confirmed_by_customer: form.age_confirmed_by_customer,
      terms_accepted: form.terms_accepted,
      items,
    }

    try {
      const order = await createPublicOrder(TENANT_SLUG, payload)
      onOrderCreated(order)
    } catch (err) {
      const msg = err?.message || 'Checkout failed.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitClick = () => {
    setSubmitError(null)
    handleSubmit()
  }

  const canSubmit = !isEmpty && selectedZoneId && form.terms_accepted && (hasAlcoholic ? form.age_confirmed_by_customer : true)

  const PAYMENT_OPTIONS = [
    { value: 'CASH', label: 'CASH' },
    { value: 'TRANSFER', label: 'TRANSFER' },
    { value: 'YAPPY_MANUAL', label: 'YAPPY_MANUAL' },
    { value: 'OTHER_MANUAL', label: 'OTHER_MANUAL' },
  ]

  const deliveryNote = 'Our partners practice responsible delivery. You must present a valid physical ID at delivery to confirm you are of legal drinking age.'

  if (isEmpty) {
    return (
      <div className="checkout-view">
        <div className="checkout-view__header">
          <button className="checkout-view__back-btn" onClick={onBackToCatalog} aria-label="Back to catalog">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="checkout-view__title">Drinklivery</h1>
          <div className="checkout-view__spare" />
        </div>

        <div className="checkout-view__body">
          <div className="checkout-view__empty">
            <span className="checkout-view__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M3 5a2 2 0 0 1 2-2h1l2 10h6l2-10h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"/><path d="M5 3v2"/><path d="M19 3v2"/><path d="M10 3v4"/><path d="M14 3v4"/></svg>
            </span>
            <p className="checkout-view__empty-text">There is nothing to checkout.</p>
            <button className="checkout-view__empty-btn" onClick={onBackToCatalog}>Return to catalog</button>
          </div>
        </div>
      </div>
    )
  }

  const selectedZone = zones.find(z => z.id === selectedZoneId) || null
  const checkoutDeliveryFee = Number(selectedZone?.base_fee ?? deliveryFee ?? 0)

  const total = (cartSubtotal + checkoutDeliveryFee).toFixed(2)

  const handleZoneSelect = (id) => setSelectedZoneId(id)

  const renderDeliveryZonesSection = () => {
    if (loading) {
      return (
        <section className="delivery-zones-section" aria-label="Delivery zones loading">
          <h2 className="delivery-zones-section__title">Select delivery area</h2>
          <div className="delivery-zones-section__loading">
            <div className="delivery-zones-skeleton-card"></div>
            <div className="delivery-zones-skeleton-card"></div>
          </div>
        </section>
      )
    }

    if (error) {
      return (
        <section className="delivery-zones-section" aria-label="Delivery zones error">
          <h2 className="delivery-zones-section__title">Select delivery area</h2>
          <div className="delivery-zones-section__error">
            <p className="delivery-zones-section__error-text">{error}</p>
            <button className="delivery-zones-section__retry-btn" type="button" onClick={handleRetry}>Retry</button>
          </div>
        </section>
      )
    }

    if (!loading && zones.length === 0) {
      return (
        <section className="delivery-zones-section" aria-label="Delivery zones">
          <h2 className="delivery-zones-section__title">Select delivery area</h2>
          <div className="delivery-zones-section__empty">
            <p className="delivery-zones-section__empty-text">No delivery zones are available right now.</p>
          </div>
        </section>
      )
    }

    return (
      <section className="delivery-zones-section" aria-label="Delivery zones">
        <h2 className="delivery-zones-section__title">Select delivery area</h2>
        <div className="delivery-zones-section__cards">
          {zones.map(zone => {
            const isSelected = zone.id === selectedZoneId
            const baseFee = Number(zone.base_fee ?? 0)
            const minimumOrderAmount = zone.minimum_order_amount != null ? Number(zone.minimum_order_amount) : null
            const minOrderText = minimumOrderAmount != null ? `Min $${minimumOrderAmount.toFixed(2)}` : ''
            return (
              <div
                key={zone.id}
                className={`delivery-zone-card ${isSelected ? 'delivery-zone-card--active' : ''}`}
                onClick={() => handleZoneSelect(zone.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleZoneSelect(zone.id)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="delivery-zone-card__left">
                  <span className="delivery-zone-card__radio" />
                  <div className="delivery-zone-card__info">
                    <h3 className="delivery-zone-card__name">{zone.name}</h3>
                    <span className="delivery-zone-card__meta">{zone.city}</span>
                    <span className="delivery-zone-card__delivery-fee">${baseFee.toFixed(2)}</span>
                    {minOrderText && <span className="delivery-zone-card__min-order">{minOrderText}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="checkout-view">
      <div className="checkout-view__header">
        <button className="checkout-view__back-btn" onClick={onBackToCart} aria-label="Back to cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="checkout-view__title">Drinklivery</h1>
        <div className="checkout-view__spare" />
      </div>

      <div className="checkout-view__body">
        <h2 className="checkout-view__section-title">Checkout</h2>

        <p className="checkout-view__note">{deliveryNote}</p>

        {renderDeliveryZonesSection()}

        <div className="checkout-view__form glass-panel" aria-label="Checkout details">
          <section className="checkout-view__fieldset">
            <h3 className="checkout-view__legend">Customer</h3>
            <div className="checkout-view__grid">
              <label className="checkout-view__field">
                <span className="checkout-view__label">Full name</span>
                <input
                  className="checkout-view__input"
                  type="text"
                  value={form.customer.full_name}
                  onChange={event => setField('customer', 'full_name', event.target.value)}
                  placeholder="Ana Perez"
                />
              </label>
              <label className="checkout-view__field">
                <span className="checkout-view__label">Phone</span>
                <input
                  className="checkout-view__input"
                  type="tel"
                  value={form.customer.phone}
                  onChange={event => setField('customer', 'phone', event.target.value)}
                  placeholder="+507 6000-0000"
                />
              </label>
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Email optional</span>
                <input
                  className="checkout-view__input"
                  type="email"
                  value={form.customer.email}
                  onChange={event => setField('customer', 'email', event.target.value)}
                  placeholder="ana@example.com"
                />
              </label>
            </div>
          </section>

          <section className="checkout-view__fieldset">
            <h3 className="checkout-view__legend">Delivery address</h3>
            <div className="checkout-view__grid">
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Address line</span>
                <input
                  className="checkout-view__input"
                  type="text"
                  value={form.address.address_line}
                  onChange={event => setField('address', 'address_line', event.target.value)}
                  placeholder="Street, building, house or apartment"
                />
              </label>
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Building details optional</span>
                <input
                  className="checkout-view__input"
                  type="text"
                  value={form.address.building_details}
                  onChange={event => setField('address', 'building_details', event.target.value)}
                  placeholder="Tower, floor, apartment, gate code"
                />
              </label>
              <label className="checkout-view__field">
                <span className="checkout-view__label">City</span>
                <input
                  className="checkout-view__input"
                  type="text"
                  value={form.address.city}
                  onChange={event => setField('address', 'city', event.target.value)}
                  placeholder="Panama City"
                />
              </label>
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Delivery notes optional</span>
                <textarea
                  className="checkout-view__textarea"
                  value={form.address.delivery_notes}
                  onChange={event => setField('address', 'delivery_notes', event.target.value)}
                  placeholder="Call on arrival, parking notes, lobby instructions"
                  rows="3"
                />
              </label>
            </div>
          </section>

          <section className="checkout-view__fieldset">
            <h3 className="checkout-view__legend">Schedule and payment</h3>
            <div className="checkout-view__grid">
              <label className="checkout-view__field">
                <span className="checkout-view__label">Scheduled date</span>
                <input
                  className="checkout-view__input"
                  type="date"
                  value={form.scheduled_date}
                  onChange={event => setFieldRoot('scheduled_date', event.target.value)}
                />
              </label>
              <label className="checkout-view__field">
                <span className="checkout-view__label">Time window</span>
                <input
                  className="checkout-view__input"
                  type="text"
                  value={form.scheduled_time_window}
                  onChange={event => setFieldRoot('scheduled_time_window', event.target.value)}
                  placeholder="18:00-20:00"
                />
              </label>
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Payment method</span>
                <select
                  className="checkout-view__select"
                  value={form.payment_method}
                  onChange={event => setFieldRoot('payment_method', event.target.value)}
                >
                  <option value="">Select payment method</option>
                  {PAYMENT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="checkout-view__field checkout-view__field--wide">
                <span className="checkout-view__label">Customer notes optional</span>
                <textarea
                  className="checkout-view__textarea"
                  value={form.customer_notes}
                  onChange={event => setFieldRoot('customer_notes', event.target.value)}
                  placeholder="Birthday setup, preferred garnish, or preparation notes"
                  rows="3"
                />
              </label>
            </div>
          </section>

          <section className="checkout-view__fieldset checkout-view__fieldset--compact">
            <label className="checkout-view__checkbox-row">
              <input
                type="checkbox"
                checked={form.terms_accepted}
                onChange={event => setFieldRoot('terms_accepted', event.target.checked)}
              />
              <span className="checkout-view__checkbox-text">I accept the delivery terms and understand this order may be rejected if area, schedule, availability, or compliance rules are not met.</span>
            </label>
            {hasAlcoholic && (
              <label className="checkout-view__checkbox-row checkout-view__checkbox-row--required">
                <input
                  type="checkbox"
                  checked={form.age_confirmed_by_customer}
                  onChange={event => setFieldRoot('age_confirmed_by_customer', event.target.checked)}
                />
                <span className="checkout-view__checkbox-text">
                  <span className="checkout-view__required-asterisk">*</span>
                  I confirm the receiver is of legal drinking age and will present a valid physical ID at delivery.
                </span>
              </label>
            )}
          </section>

          <button
            className="checkout-view__submit"
            type="button"
            disabled={submitting || !canSubmit}
            onClick={handleSubmitClick}
          >
            {submitting ? 'Submitting...' : 'Place order'}
          </button>

          {submitError && (
            <p className="checkout-view__submit-error" role="alert">
              {submitError}
            </p>
          )}
        </div>

        <div className="checkout-view__summary glass-panel">
          {cartItems.map(item => (
            <div key={item.key} className="checkout-view__summary-row">
              <span className="checkout-view__item-label">
                {item.isAlcoholic && (
                  <span className="checkout-view__beer-badge" title="Alcohol — age restriction applies">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
                      <path d="M3 8h14a4 4 0 0 1 0 8H6"/>
                      <path d="M7 8V6a2 2 0 0 1 2-2h1a4 4 0 0 1 3.7 2.1"/>
                      <path d="M7 8V5a2 2 0 0 1 2-2"/>
                    </svg>
                  </span>
                )}
                {item.name}
                {item.variantName ? ` - ${item.variantName}` : ''}
                {` x${item.quantity}`}
              </span>
              <span className="checkout-view__item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="checkout-view__divider" />

          <div className="checkout-view__summary-row">
            <span>Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-view__summary-row">
            <span>
              Delivery fee{selectedZone ? ` (${selectedZone.name})` : ''}
            </span>
            <span>${checkoutDeliveryFee.toFixed(2)}</span>
          </div>
          <div className="checkout-view__total-row">
            <span>Total</span>
            <span className="checkout-view__total-value">${total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
