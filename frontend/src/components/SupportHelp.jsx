import { useNavigate } from 'react'
import { motion } from 'motion/react'

const HelpSection = ({ title, children }) => (
  <section className="support-section">
    <h2 className="support-section__title">{title}</h2>
    <div className="support-card">{children}</div>
  </section>
)

function SupportHelp() {
  const navigate = useNavigate()

  return (
    <div className="support-view">
      {/* Hero */}
      <motion.section
        className="support-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="support-hero__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <h1 className="support-hero__title">Support &amp; Help</h1>
        <p className="support-hero__subtitle">Everything you need to know about Drinklivery cocktail kits.</p>
      </motion.section>

      <section className="support-content">
        <HelpSection title="How Drinklivery works">
          <p>Order your cocktail kit online, choose your delivery window, and relax. We deliver sealed, temperature-controlled kits ready to mix and serve at your event.</p>
        </HelpSection>

        <HelpSection title="Delivered cold, sealed, and ready to serve">
          <p>Every kit ships in insulated packaging with ice packs to keep spirits and mixers fresh until they reach you. No fridge needed on delivery day — just pour and enjoy.</p>
        </HelpSection>

        <HelpSection title="Delivery zones in Panama City">
          <p>We currently deliver to Panama City and surrounding areas. Enter your address at checkout to confirm availability for your location.</p>
        </HelpSection>

        <HelpSection title="Payment options: cash, card (manual), Yappy">
          <p>We accept cash on delivery, manual card processing through our secure checkout flow, and Yappy for instant transfers. Select your preferred method at checkout.</p>
        </HelpSection>

        <HelpSection title="Legal drinking age and physical ID">
          <p>You must be of legal drinking age in Panama. The driver will request a valid government-issued photo ID upon delivery. No exceptions.</p>
        </HelpSection>

        <HelpSection title="Scheduling your delivery">
          <p>Choose a 2-hour delivery window at checkout. We'll arrive within that window — plan ahead and let us handle the rest.</p>
        </HelpSection>

        <HelpSection title="Mocktails and party packs">
          <p>Not drinking? Our mocktail kits include the same premium presentation with alcohol-free flavor profiles. Party packs scale up for bigger groups.</p>
        </HelpSection>

        <HelpSection title="Need help?">
          <p>For questions or special requests, contact us through our app or visit your account page to find support options as they become available.</p>
        </HelpSection>
      </section>

      {/* CTAs */}
      <div className="support-footer-cta">
        <button className="primary-btn" onClick={() => navigate('/')}>
          Back to catalog
        </button>
        <button className="secondary-link-btn" onClick={() => navigate('/account')}>
          Account &amp; orders
        </button>
      </div>
    </div>
  )
}

export default SupportHelp
