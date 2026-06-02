import { useState } from 'react'

function ProductDetail({ product, onBack, onAddToCart, addingFeedback = false }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [qty, setQty] = useState(1)
  const [imageFailed, setImageFailed] = useState(false)

  const variants = product.variants && product.variants.length > 0 ? product.variants : []
  const price = Number(selectedVariant?.price ?? product.base_price ?? 0)
  const imageUrl = product.image || ''
  const hasImage = imageUrl && imageUrl.trim() !== '' && !imageFailed
  const variantName = selectedVariant?.name || ''
  const servings = selectedVariant?.servings ?? product.servings

  function handleAddToCart() {
    if (!onAddToCart) return

    onAddToCart({
      key: `${product.id}-${selectedVariant?.id ?? 'base'}`,
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantName,
      price,
      quantity: qty,
      imageUrl,
      isAlcoholic: Boolean(product.is_alcoholic),
    })
  }

  return (
    <div className="product-detail">
      <div className="product-detail__header">
        <button className="product-detail__back" onClick={onBack} aria-label="Back to catalog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div className="product-detail__body">
        <div className="product-detail__image-card">
          {hasImage && (
            <img
              src={imageUrl}
              alt={product.name}
              className="product-detail__image"
              onError={() => setImageFailed(true)}
            />
          )}
          <div className={`product-detail__image-placeholder ${hasImage ? 'product-detail__image-placeholder--hidden' : ''}`}>
            <span style={{ fontSize: '3rem', opacity: 0.4 }}>DR</span>
          </div>

          <div className="product-detail__badges">
            <span className="product-detail__badge">
              <span style={{ fontSize: '16px' }}>{product.is_alcoholic ? 'A' : 'N'}</span>
              {product.is_alcoholic ? 'Alcoholic' : 'Non-alcoholic'}
            </span>
            {servings != null && (
              <span className="product-detail__badge product-detail__badge--secondary">
                <span style={{ fontSize: '16px' }}>S</span>
                {servings} servings
              </span>
            )}
          </div>
        </div>

        <div className="product-detail__content">
          <div className="product-detail__header-row">
            <div>
              <h1 className="product-detail__name">{product.name}</h1>
              <p className="product-detail__desc">{product.description}</p>
            </div>
            <div className="product-detail__price-wrap">
              <span className="product-detail__price">${price.toFixed(2)}</span>
            </div>
          </div>

          {servings != null && (
            <p className="product-detail__servings">
              {variantName ? `${variantName} - ` : ''}Serves {servings} person{servings > 1 ? 's' : ''}
            </p>
          )}

          <div className="product-detail__divider" />

          {variants.length > 0 && (
            <div className="product-detail__variants">
              <h3 className="product-detail__variants-title">Select Size</h3>
              <div className="product-detail__variants-grid">
                {variants.map((variant, idx) => {
                  const vName = variant.name || variant.label || `Variant ${idx + 1}`
                  const vPrice = Number(variant.price ?? product.base_price ?? 0)
                  const isSelected = selectedVariant?.id === variant.id

                  return (
                    <div key={variant.id ?? idx} className="product-detail__variant-item">
                      <input
                        type="radio"
                        id={`variant-${variant.id ?? idx}`}
                        name="variant"
                        className="product-detail__variant-radio"
                        checked={isSelected}
                        onChange={() => setSelectedVariant(variant)}
                      />
                      <label
                        htmlFor={`variant-${variant.id ?? idx}`}
                        className={`product-detail__variant-label ${isSelected ? 'product-detail__variant-label--active' : ''}`}
                      >
                        <span className="product-detail__variant-label-name">{vName}</span>
                        <span className="product-detail__variant-label-price">${vPrice.toFixed(2)}</span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="product-detail__quantity">
            <h3 className="product-detail__quantity-title">Quantity</h3>
            <div className="product-detail__qty-wrap">
              <button
                className="product-detail__qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <span className="product-detail__qty-value">{qty}</span>
              <button
                className="product-detail__qty-btn"
                onClick={() => setQty(q => q + 1)}
                aria-label="Increase quantity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
          </div>

          <div className="product-detail__compliance">
            <span style={{ fontSize: '16px' }}>!</span>
            <span>Alcohol delivery requires adult confirmation at delivery. Please enjoy responsibly.</span>
          </div>

          <button
            className={`product-detail__cta ${addingFeedback ? 'product-detail__cta--feedback' : ''}`}
            onClick={handleAddToCart}
          >
            <span style={{ fontSize: '20px' }}>Cart</span>
            {addingFeedback ? 'Added to cart' : `Add to Cart - $${(price * qty).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
