import { useState } from 'react'

function ProductDetail({ product, onBack, onAddToCart, addingFeedback = false }) {
  const [selectedBase, setSelectedBase] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [qty, setQty] = useState(1)
  const [imageFailed, setImageFailed] = useState(false)

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
    <div className="premium-detail">
      {/* Mobile top overlay */}
      <div className="premium-detail__overlay">
        <button className="premium-detail__back" onClick={onBack} aria-label="Back to catalog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div className="premium-detail__body">
        {/* Visual area */}
        <div className={`premium-detail__visual ${heroHeight}`}>
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

          <span
            className="premium-detail__badges"
            style={{ background: badgeBg, color: badgeColor }}
          >
            {badgeText}
          </span>
        </div>

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
              <span>Contains alcohol. Must be 21+ to purchase.</span>
            </div>
          )}

          {product.description && (
            <div className="premium-detail__desc-wrap">
              <h2 className="premium-detail__section-label">Description</h2>
              <p className="premium-detail__desc">{product.description}</p>
            </div>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="premium-detail__variants-section">
              <h3 className="premium-detail__section-label">Select Size</h3>
              <div className="premium-detail__variants-grid">
                {/* Base option */}
                {hasBaseOption && (
                  <div className="premium-detail__variant-item">
                    <input
                      type="radio"
                      id="variant-base"
                      name="variant"
                      className="premium-detail__variant-radio"
                      checked={isBaseSelected}
                      onChange={handleSelectBase}
                    />
                    <label
                      htmlFor="variant-base"
                      className={`premium-detail__variant-label ${isBaseSelected ? 'premium-detail__variant-label--active' : ''}`}
                    >
                      <span className="premium-detail__variant-label-name">{product.name}</span>
                      <span className="premium-detail__variant-label-price">${Number(product.base_price ?? 0).toFixed(2)}</span>
                    </label>
                  </div>
                )}
                {variants.map((variant, idx) => {
                  const vName = variant.name || variant.label || `Variant ${idx + 1}`
                  const vPrice = Number(variant.price ?? product.base_price ?? 0)
                  const isSelected = !selectedBase && selectedVariant?.id === variant.id

                  return (
                    <div key={variant.id ?? idx} className="premium-detail__variant-item">
                      <input
                        type="radio"
                        id={`variant-${variant.id ?? idx}`}
                        name="variant"
                        className="premium-detail__variant-radio"
                        checked={isSelected}
                        onChange={() => handleSelectVariant(variant)}
                      />
                      <label
                        htmlFor={`variant-${variant.id ?? idx}`}
                        className={`premium-detail__variant-label ${isSelected ? 'premium-detail__variant-label--active' : ''}`}
                      >
                        <span className="premium-detail__variant-label-name">{vName}</span>
                        <span className="premium-detail__variant-label-price">${vPrice.toFixed(2)}</span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="premium-detail__cta-spacer" />
        </div>
      </div>

      {/* Fixed bottom CTA bar */}
      <div className="premium-detail__cta-bar">
        <div className="premium-detail__cta-wrap">
          {/* Quantity in CTA bar */}
          <div className="premium-detail__qty-pill">
            <button
              className="premium-detail__qty-pill-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <span className="premium-detail__qty-pill-val">{qty}</span>
            <button
              className="premium-detail__qty-pill-btn"
              onClick={() => setQty(q => q + 1)}
              aria-label="Increase quantity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>

          {/* Add to cart CTA */}
          <button
            className={`premium-detail__cta ${addingFeedback ? 'premium-detail__cta--feedback' : ''}`}
            onClick={handleAddToCart}
          >
            {addingFeedback ? (
              'Added to cart'
            ) : (
              <>Add to cart · <span className="premium-detail__cta-price">${(price * qty).toFixed(2)}</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
