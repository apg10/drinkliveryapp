import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

function ProductDetail({ product, onBack, onAddToCart, addingFeedback = false, onOpenExtras }) {
  const [selectedBase, setSelectedBase] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [qty, setQty] = useState(1)
  const [imageFailed, setImageFailed] = useState(false)

  const [hasReducedMotion, setHasReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    function handler(e) {
      setHasReducedMotion(e.matches)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  function springConfig(stiffness, damping, mass) {
    if (hasReducedMotion) return undefined
    return { type: 'spring', stiffness: stiffness, damping: damping || stiffness, mass: mass || 0.9 }
  }

  function motionProps(initial, animate, exit, transition) {
    if (hasReducedMotion) return { initial: false, animate: undefined, exit: undefined, transition: undefined }
    return { initial, animate, exit, transition: transition || springConfig(360, 28, 0.9) }
  }

  const variants = product.variants && product.variants.length > 0 ? product.variants : []
  const hasBaseOption = product.base_price != null
  const isBaseSelected = selectedBase && !selectedVariant
  const price = isBaseSelected
    ? Number(product.base_price ?? 0)
    : Number(selectedVariant?.price ?? product.base_price ?? 0)
  const imageUrl = product.image || ''
  const hasImage = imageUrl && imageUrl.trim() !== '' && !imageFailed
  const variantName = isBaseSelected
    ? ''
    : (selectedVariant?.name || '')
  const servings = selectedVariant?.servings ?? product.servings

  const isAlcoholic = product.is_alcoholic === true

  // Safe optional-cups copy (does not imply cart add-on support)
  const hasOptionalCupsField = product.includes_cups != null || product.cups != null || product.addons != null
  const includesCups = product.includes_cups === true
  let cupsCopy = null

  // Safely read cup labels from product.cups array if present
  if (Array.isArray(product.cups)) {
    cupsCopy = product.cups
      .filter(Boolean)
      .map(c => {
        if (typeof c === 'string') return c.trim()
        return c.name || c.label || c.title || ''
      })
      .filter(Boolean)
      .join(', ') || null
  }

  // Safely filter cup-like addons (only show items clearly related to cups)
  if (Array.isArray(product.addons)) {
    const cupSafelist = ['cups', 'glasses', 'drinking glasses', 'cocktail glasses', 'martini glasses', 'wine glasses', '"cups"', '"glasses"']
    const addonLabels = product.addons
      .filter(Boolean)
      .map(a => String(a).toLowerCase().trim())
      .filter(name => cupSafelist.some(kw => name.includes(kw)))
      .join(', ')
    if (!cupsCopy && addonLabels) {
      cupsCopy = addonLabels
    }
  }

  // If includes_cups === true, show a clear cups-included label with CSS class styling
  if (includesCups && !cupsCopy) {
    cupsCopy = 'Cups included'
  }

  const hasFilteredCups = !!cupsCopy

  function handleAddToCart() {
    if (!onAddToCart) return

    const hasVariant = !!selectedVariant
    const effectiveKey = hasVariant
      ? `${product.id}-${selectedVariant.id}`
      : `${product.id}-base`
    const effectiveVariantId = hasVariant ? selectedVariant.id : null
    const effectiveVariantName = hasVariant ? (selectedVariant.name || '') : ''

    onAddToCart({
      key: effectiveKey,
      productId: product.id,
      variantId: effectiveVariantId,
      name: product.name,
      variantName: effectiveVariantName,
      price,
      quantity: qty,
      imageUrl,
      isAlcoholic,
    })
  }

  function handleSelectBase() {
    setSelectedBase(true)
    setSelectedVariant(null)
  }

  function handleSelectVariant(variant) {
    setSelectedBase(false)
    setSelectedVariant(variant)
  }

  const heroHeight = hasImage ? '' : 'premium-detail__visual--compact'
  const fallbackBg = isAlcoholic
    ? 'radial-gradient(ellipse at 35% 45%, rgba(255,107,74,0.18) 0%, transparent 55%), radial-gradient(ellipse at 65% 65%, rgba(238,192,88,0.12) 0%, transparent 50%), linear-gradient(135deg, var(--surface-container) 60%, var(--surface-container-highest) 100%)'
    : 'radial-gradient(ellipse at 65% 35%, rgba(160,215,87,0.15) 0%, transparent 55%), radial-gradient(ellipse at 35% 65%, rgba(238,192,88,0.1) 0%, transparent 50%), linear-gradient(135deg, var(--surface-container) 60%, var(--surface-container-highest) 100%)'

  const badgeBg = isAlcoholic
    ? 'linear-gradient(135deg, rgba(160,215,87,0.15), rgba(238,192,88,0.15))'
    : 'linear-gradient(135deg, rgba(238,192,88,0.15), rgba(160,215,87,0.15))'
  const badgeColor = isAlcoholic ? 'var(--secondary)' : 'var(--tertiary)'
  const badgeText = isAlcoholic ? 'Alcoholic' : 'Non-alcoholic'

  return (
    <div
      className="premium-detail"
    >
      {/* Mobile top overlay */}
      <div className="premium-detail__overlay">
        <motion.button
          className="premium-detail__back"
          onClick={onBack}
          aria-label="Back to catalog"
          style={{ scale: hasReducedMotion ? undefined : 1 }}
          whileHover={springConfig(400, 22, 0.8) ? { scale: 1.08 } : undefined}
          whileTap={springConfig(400, 22, 0.8) ? { scale: 0.92 } : undefined}
          transition={springConfig(400, 22, 0.8)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </motion.button>
      </div>

      <div className="premium-detail__body">
        {/* Visual area */}
        <motion.div
          className={`premium-detail__visual ${heroHeight}`}
          {...motionProps({ opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 }, undefined, springConfig(320, 28, 0.85))}
        >
          {hasImage && (
            <img
              src={imageUrl}
              alt={product.name}
              className="premium-detail__image"
              onError={() => setImageFailed(true)}
            />
          )}
          <div
            className={`premium-detail__fallback ${hasImage ? 'premium-detail__fallback--hidden' : ''}`}
            style={hasImage ? {} : { background: fallbackBg }}
          >
            <span className="premium-detail__fallback-label">
              {product.is_alcoholic ? 'Cocktail' : 'Mocktail'}
            </span>
          </div>

          <motion.span
            className="premium-detail__badges"
            style={{ background: badgeBg, color: badgeColor }}
            {...motionProps({ opacity: 0, y: 8 }, { opacity: 1, y: 0 }, undefined, { delay: 0.15, ...springConfig(340, 26) })}
          >
            {badgeText}
          </motion.span>
        </motion.div>

        {/* Purchase info section - tight hierarchy */}
        <div className="premium-detail__content">
          <div className="premium-detail__title-row">
            <h1 className="premium-detail__name">{product.name}</h1>
            <span className="premium-detail__price">${price.toFixed(2)}</span>
          </div>

          {variantName && !isBaseSelected && (
            <span className="premium-detail__variant-label-text">{variantName}</span>
          )}

          {servings != null && (
            <div className="premium-detail__info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Serves {servings} · Ready to pour</span>
            </div>
          )}

          {isAlcoholic && (
            <div className="premium-detail__compliance-strip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 9v4"/><circle cx="12" cy="16" r=".5"/></svg>
              <span>Contains alcohol. You must be 21+ and show physical ID at delivery to receive this order.</span>
            </div>
          )}

          {product.description && (
            <div className="premium-detail__desc-wrap">
              <h2 className="premium-detail__section-label">Description</h2>
              <p className="premium-detail__desc">{product.description}</p>
            </div>
          )}

          {/* What's Included — cocktail kit contents */}
          {(() => {
            const isCocktail = isAlcoholic
            let items = [
              `${isCocktail ? 'Sealed cocktail mix' : 'Sealed mocktail mix'}`,
              'Fresh garnish',
              'Ice',
              'Pouring instructions',
            ]
            return (
              <motion.div
                className="premium-detail__whats-included"
                {...motionProps({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, undefined, springConfig(340, 26))}
              >
                <h3 className="premium-detail__section-label">What's Included</h3>
                {hasFilteredCups ? (
                  <p className="premium-detail__included-cups">{cupsCopy}</p>
                ) : null}
                {hasOptionalCupsField && !hasFilteredCups ? (
                  <p className="premium-detail__included-cups-fallback">Optional cups available as an add-on</p>
                ) : null}
                <ul className="premium-detail__included-list">
                  {items.map((text, idx) => (
                    <li key={`${text}-${idx}`} className="premium-detail__included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`var(--${isCocktail ? 'secondary' : 'tertiary'})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })()}

          {/* How To Serve — safe static fallback */}
          {(() => {
            const steps = product.instructions && Array.isArray(product.instructions) && product.instructions.length > 0
              ? product.instructions.filter(Boolean).slice(0, 5)
              : null
            if (!steps || steps.length === 0) {
              return (
                <motion.div
                  className="premium-detail__how-to-serve"
                  {...(hasReducedMotion ? {} : motionProps({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, undefined, springConfig(340, 26)))}
                >
                  <h3 className="premium-detail__section-label">How to Serve</h3>
                  <ol className="premium-detail__serve-steps">
                    <li className="premium-detail__serve-step"><span className="premium-detail__step-text">Chill the mix before opening for best taste</span></li>
                    <li className="premium-detail__serve-step"><span className="premium-detail__step-text">Pour over ice into glasses</span></li>
                    <li className="premium-detail__serve-step"><span className="premium-detail__step-text">Add the included garnish</span></li>
                    <li className="premium-detail__serve-step"><span className="premium-detail__step-text">Serve and enjoy responsibly</span></li>
                  </ol>
                </motion.div>
              )
            }
            return (
              <motion.div
                className="premium-detail__how-to-serve"
                {...(hasReducedMotion ? {} : motionProps({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, undefined, springConfig(340, 26)))}
              >
                <h3 className="premium-detail__section-label">How to Serve</h3>
                <ol className="premium-detail__serve-steps">
                  {steps.map((step, idx) => (
                    <li key={`${idx}-${step}`} className="premium-detail__serve-step">
                      <span className="premium-detail__step-text">{String(step).trim()}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )
          })()}

          {/* Perfect For — occasion chips */}
          {(() => {
            const defaultAlcoholicOccasions = ['Date night', 'Pregame', 'Dinner party', 'Weekend hosting']
            const defaultMocktailOccasions = ['Family night', 'Brunch', 'Office event', 'Alcohol-free party']
            let occasions = isAlcoholic ? defaultAlcoholicOccasions : defaultMocktailOccasions
            if (product.occasions && Array.isArray(product.occasions) && product.occasions.length > 0) {
              occasions = product.occasions.filter(Boolean).slice(0, 5)
            }
            return (
              <motion.div
                className="premium-detail__perfect-for"
                {...(hasReducedMotion ? {} : motionProps({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, undefined, springConfig(340, 26)))}
              >
                <h3 className="premium-detail__section-label">Perfect For</h3>
                <div className="premium-detail__occasion-chips">
                  {occasions.map((label, idx) => (
                    <span key={`${idx}-${label}`} className={`premium-detail__occasion-chip premium-detail__occasion-chip--${isAlcoholic ? 'cocktail' : 'mocktail'}`}>{label}</span>
                  ))}
                </div>
              </motion.div>
            )
          })()}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="premium-detail__variants-section">
              <h3 className="premium-detail__section-label">Select Size</h3>
              <div className="premium-detail__variants-grid">
                {/* Base option */}
                {hasBaseOption && (
                  <motion.div
                    className="premium-detail__variant-item"
                    key="base"
                    layout={!hasReducedMotion}
                    {...motionProps({ opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, undefined, springConfig(320, 26, 0.8))}
                  >
                    <input
                      type="radio"
                      id="variant-base"
                      name="variant"
                      className="premium-detail__variant-radio"
                      checked={isBaseSelected}
                      onChange={handleSelectBase}
                    />
                    <motion.label
                      htmlFor="variant-base"
                      className={`premium-detail__variant-label ${isBaseSelected ? 'premium-detail__variant-label--active' : ''}`}
                      whileHover={springConfig(400, 20, 0.8) ? { scale: 1.02 } : undefined}
                      whileTap={springConfig(400, 20, 0.8) ? { scale: 0.97 } : undefined}
                      transition={springConfig(400, 20, 0.8)}
                    >
                      <span className="premium-detail__variant-label-name">{product.name}</span>
                      <span className="premium-detail__variant-label-price">${Number(product.base_price ?? 0).toFixed(2)}</span>
                    </motion.label>
                  </motion.div>
                )}
                {variants.map((variant, idx) => {
                  const vName = variant.name || variant.label || `Variant ${idx + 1}`
                  const vPrice = Number(variant.price ?? product.base_price ?? 0)
                  const isSelected = !selectedBase && selectedVariant?.id === variant.id

                  return (
                    <motion.div
                      key={variant.id ?? idx}
                      className="premium-detail__variant-item"
                      layout={!hasReducedMotion}
                      {...motionProps({ opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, undefined, { ...springConfig(320, 26, 0.8), delay: (idx + 1) * 0.04 })}
                    >
                      <input
                        type="radio"
                        id={`variant-${variant.id ?? idx}`}
                        name="variant"
                        className="premium-detail__variant-radio"
                        checked={isSelected}
                        onChange={() => handleSelectVariant(variant)}
                      />
                      <motion.label
                        htmlFor={`variant-${variant.id ?? idx}`}
                        className={`premium-detail__variant-label ${isSelected ? 'premium-detail__variant-label--active' : ''}`}
                        whileHover={springConfig(400, 20, 0.8) ? { scale: 1.02 } : undefined}
                        whileTap={springConfig(400, 20, 0.8) ? { scale: 0.97 } : undefined}
                        transition={springConfig(400, 20, 0.8)}
                      >
                        <span className="premium-detail__variant-label-name">{vName}</span>
                        <span className="premium-detail__variant-label-price">${vPrice.toFixed(2)}</span>
                      </motion.label>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {onOpenExtras && (
            <motion.div
              className="premium-detail__extras-preview glass-panel"
              {...motionProps({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, undefined, springConfig(340, 26))}
            >
              <span className="premium-detail__extras-preview-label">Need cups, extra ice, or snacks?</span>
              <button className="secondary-link-btn premium-detail__extras-preview-btn" type="button" onClick={onOpenExtras}>Preview add-ons</button>
            </motion.div>
          )}

          <div className="premium-detail__cta-spacer" />
        </div>
      </div>

      {/* Fixed bottom CTA bar */}
      <motion.div
        className="premium-detail__cta-bar"
        {...motionProps({ opacity: 0, y: 24 }, { opacity: 1, y: 0 }, undefined, springConfig(360, 28, 0.9))}
      >
        <div className="premium-detail__cta-wrap">
          {/* Quantity in CTA bar */}
          <motion.div className="premium-detail__qty-pill" layout={!hasReducedMotion}>
            <motion.button
              className="premium-detail__qty-pill-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              whileHover={springConfig(400, 22, 0.8) ? { scale: 1.08 } : undefined}
              whileTap={springConfig(400, 22, 0.8) ? { scale: 0.9 } : undefined}
              transition={springConfig(400, 22, 0.8)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </motion.button>
            {hasReducedMotion ? (
              <span className="premium-detail__qty-pill-val">{qty}</span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={qty}
                  className="premium-detail__qty-pill-val"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={springConfig(380, 24)}
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
            )}
            <motion.button
              className="premium-detail__qty-pill-btn"
              onClick={() => setQty(q => q + 1)}
              aria-label="Increase quantity"
              whileHover={springConfig(400, 22, 0.8) ? { scale: 1.08 } : undefined}
              whileTap={springConfig(400, 22, 0.8) ? { scale: 0.9 } : undefined}
              transition={springConfig(400, 22, 0.8)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </motion.button>
          </motion.div>

          {/* Add to cart CTA */}
          <motion.button
            className={`premium-detail__cta ${addingFeedback ? 'premium-detail__cta--feedback' : ''}`}
            onClick={handleAddToCart}
            whileHover={springConfig(400, 22, 0.8) ? { scale: 1.02 } : undefined}
            whileTap={springConfig(400, 22, 0.8) ? { scale: 0.97 } : undefined}
            transition={springConfig(400, 22, 0.8)}
          >
            {addingFeedback ? (
              'Added to cart'
            ) : (
              <>Add to cart · <span className="premium-detail__cta-price">${(price * qty).toFixed(2)}</span></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetail
