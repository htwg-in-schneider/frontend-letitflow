
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

async function getJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export function fetchCategories() {
  return getJson('/api/categories')
}

export function fetchProducts(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  const query = params.toString()
  const url = query ? `/api/products?${query}` : '/api/products'

  return getJson(url)
}

export function fetchProductById(id) {
  return getJson(`/api/products/${id}`)
}

export function fetchProductVariants(id) {
  return getJson(`/api/products/${id}/variants`)
}

