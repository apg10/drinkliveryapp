export const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"

export function apiGet(path) {
  const url = baseUrl.endsWith("/") && path.startsWith("/")
    ? baseUrl.slice(0, -1) + path
    : baseUrl + path

  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`apiGet ${url} -> ${res.status}`)
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
