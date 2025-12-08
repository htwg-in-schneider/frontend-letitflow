
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

// Einzelne Kategorie holen
export function fetchCategoryById(id) {
  return getJson(`/api/categories/${id}`)
}

// Kategorie erstellen
export function createCategory(payload) {
  return requestJson('/api/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Kategorie aktualisieren
export function updateCategory(id, payload) {
  return requestJson(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

// Kategorie löschen
export function deleteCategory(id) {
  return requestJson(`/api/categories/${id}`, {
    method: 'DELETE'
  })
}

// Produkt erstellen
export function createProduct(payload) {
  return requestJson('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Produkt aktualisieren
export function updateProduct(id, payload) {
  return requestJson(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

// Produkt löschen
export function deleteProduct(id) {
  return requestJson(`/api/products/${id}`, {
    method: 'DELETE'
  })
}

// Variante für ein Produkt erstellen
export function createVariant(productId, payload) {
  return requestJson(`/api/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Variante aktualisieren
export function updateVariant(id, payload) {
  return requestJson(`/api/variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

// Variante löschen
export function deleteVariant(id) {
  return requestJson(`/api/variants/${id}`, {
    method: 'DELETE'
  })
}



