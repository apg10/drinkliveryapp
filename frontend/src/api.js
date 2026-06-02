export const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"

export function apiGet(path) {
  const url = baseUrl.endsWith("/") && path.startsWith("/")
    ? baseUrl.slice(0, -1) + path
    : baseUrl + path

  return fetch(url).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        const detail = err?.error ?? err?.detail ?? ''
        const message = detail && typeof detail === 'string'
          ? detail
          : detail && typeof detail === 'object'
            ? JSON.stringify(detail)
            : `apiGet ${url} -> ${res.status}`
        const error = new Error(message)
        error.status = res.status
        throw error
      }).catch(e => {
        if (e.status) throw e
        const error = new Error(`apiGet ${url} -> ${res.status}`)
        error.status = res.status
        throw error
      })
    }
    return res.json()
  })
}

export function getPublicCatalog(tenantSlug) {
  return apiGet(`/public/${tenantSlug}/catalog/`)
}

export function getPublicProduct(tenantSlug, productSlug) {
  return apiGet(`/public/${tenantSlug}/products/${productSlug}/`)
}

export function getPublicDeliveryZones(tenantSlug) {
  return apiGet(`/public/${tenantSlug}/delivery-zones/`)
}

export function apiPost(path, payload) {
  const url = baseUrl.endsWith("/") && path.startsWith("/")
    ? baseUrl.slice(0, -1) + path
    : baseUrl + path

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        const detail = err?.error ?? err?.detail ?? ''
        const message = detail && typeof detail === 'string'
          ? detail
          : detail && typeof detail === 'object'
            ? JSON.stringify(detail)
            : `apiPost ${url} -> ${res.status}`
        const error = new Error(message)
        error.status = res.status
        throw error
      }).catch(e => {
        if (e.status) throw e
        const error = new Error(`apiPost ${url} -> ${res.status}`)
        error.status = res.status
        throw error
      })
    }
    return res.json()
  })
}

export function apiPatch(path, payload) {
  const url = baseUrl.endsWith("/") && path.startsWith("/")
    ? baseUrl.slice(0, -1) + path
    : baseUrl + path

  return fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        const detail = err?.error ?? err?.detail ?? ''
        const message = detail && typeof detail === 'string'
          ? detail
          : detail && typeof detail === 'object'
            ? JSON.stringify(detail)
            : `apiPatch ${url} -> ${res.status}`
        const error = new Error(message)
        error.status = res.status
        throw error
      }).catch(e => {
        if (e.status) throw e
        const error = new Error(`apiPatch ${url} -> ${res.status}`)
        error.status = res.status
        throw error
      })
    }
    return res.json()
  })
}

export function createPublicOrder(tenantSlug, payload) {
  return apiPost(`/public/${tenantSlug}/orders/`, payload)
}

export function getPublicOrderStatus(tenantSlug, orderCode) {
  return apiGet(`/public/${tenantSlug}/orders/${orderCode}/status/`)
}

export function getAdminOrders() {
  return apiGet('/admin/orders/')
}

export function getAdminOrder(id) {
  return apiGet(`/admin/orders/${id}/`)
}

export function getAdminDashboardSummary() {
  return apiGet('/admin/dashboard/summary/')
}

export function updateAdminOrderStatus(id, payload) {
  return apiPatch(`/admin/orders/${id}/status/`, payload)
}

export function updateAdminOrderPayment(id, payload) {
  return apiPatch(`/admin/orders/${id}/payment/`, payload)
}

export function submitAdminDeliveryVerification(id, payload) {
  return apiPost(`/admin/orders/${id}/delivery-verification/`, payload)
}
