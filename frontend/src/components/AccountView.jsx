import { useNavigate } from 'react'
import { motion } from 'motion/react'

function AccountView({ order = null }) {
  const navigate = useNavigate()

  return (
    <div className="account-view">
      {/* Hero */}
      <motion.section
        className="account-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="account-hero__avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <h1 className="account-hero__title">Account</h1>
        <p className="account-hero__subtitle">Your cocktail nights, orders, and delivery preferences.</p>
      </motion.section>

      {/* Profile Basics */}
      <section className="account-section">
        <h2 className="account-section__title">Profile</h2>
        <div className="account-card account-card--guest">
          <span className="account-card__label">Guest checkout</span>
          <span className="account-card__value">You are currently browsing as a guest.</span>
          <p className="account-card__note">Phone and email will be saved after login — coming later.</p>
        </div>
      </section>

      {/* Previous Orders */}
      <section className="account-section">
        <h2 className="account-section__title">Previous orders</h2>
        {order ? (
          <div className="account-card account-card--order">
            <div className="account-card__header-row">
              <span className="account-card__code">{order.order_code}</span>
              <span className={`account-card__status account-card__status--${(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>{order.status || 'N/A'}</span>
            </div>
            <p className="account-card__detail">Total: ${Number(order.total ?? 0).toFixed(2)}</p>
            <button className="account-card__reorder" disabled>
              Reorder coming soon
            </button>
          </div>
        ) : (
          <div className="account-card account-card--empty">
            <span className="account-card__empty-title">No previous orders yet.</span>
            <p className="account-card__empty-sub">Your ordered cocktail kits will appear here.</p>
          </div>
        )}
      </section>

      {/* Saved Addresses */}
      <section className="account-section">
        <h2 className="account-section__title">Saved addresses</h2>
        <div className="account-card account-card--placeholder">
          <span className="account-card__value">Saved addresses coming soon.</span>
        </div>
      </section>

      {/* Support Link */}
      <section className="account-section account-section--support-link">
        <button
          className="account-support-btn"
          onClick={() => navigate('/support')}
        >
          Need help? &rarr;
        </button>
      </section>

      {/* Footer nav CTA */}
      <div className="account-footer-cta">
        <button className="primary-btn" onClick={() => navigate('/')}>
          Back to catalog
        </button>
      </div>
    </div>
  )
}

export default AccountView
