const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

// --- HELFER FUNKTIONEN ---

async function getJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('API error', res.status, text)
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// --- KATEGORIEN ---

export function fetchCategories() { return getJson('/api/categories') }
export function fetchCategoryById(id) { return getJson(`/api/categories/${id}`) }
export function createCategory(payload) {
  return requestJson('/api/categories', { method: 'POST', body: JSON.stringify(payload) })
}
export function updateCategory(id, payload) {
  return requestJson(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteCategory(id) {
  return requestJson(`/api/categories/${id}`, { method: 'DELETE' })
}

// --- PRODUKTE ---

export function fetchProducts(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value)
  })
  const query = params.toString()
  return getJson(query ? `/api/products?${query}` : '/api/products')
}
export function fetchProductById(id) { return getJson(`/api/products/${id}`) }
export function fetchProductVariants(id) { return getJson(`/api/products/${id}/variants`) }
export function createProduct(payload) {
  return requestJson('/api/products', { method: 'POST', body: JSON.stringify(payload) })
}
export function updateProduct(id, payload) {
  return requestJson(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteProduct(id) {
  return requestJson(`/api/products/${id}`, { method: 'DELETE' })
}

// --- VARIANTEN ---

export function createVariant(productId, payload) {
  return requestJson(`/api/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(payload) })
}
export function updateVariant(id, payload) {
  return requestJson(`/api/variants/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteVariant(id) {
  return requestJson(`/api/variants/${id}`, { method: 'DELETE' })
}

// --- IMAGE UPLOAD ---

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  return res.json()
}

// --- USER ---

export function fetchUsers(params = {}) {
  const qs = new URLSearchParams()
  if (params.firstName) qs.set('firstName', params.firstName)
  if (params.lastName) qs.set('lastName', params.lastName)
  if (params.email) qs.set('email', params.email)
  if (params.role) qs.set('role', params.role)
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return getJson(`/api/users${query}`)
}
export function fetchUserById(id) { return getJson(`/api/users/${id}`) }
export function updateUser(id, payload) {
  return requestJson(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteUser(id) {
  return requestJson(`/api/users/${id}`, { method: 'DELETE' })
}

// --- WARENKORB (MIT ENCODING) ---

export function fetchCartByUserId(userId) {
  return getJson(`/api/cart?userId=${encodeURIComponent(userId)}`)
}

export function addToCart(userId, productId, variantId, quantity) {
  const uId = encodeURIComponent(userId)
  return requestJson(`/api/cart/add?userId=${uId}&productId=${productId}&variantId=${variantId}&quantity=${quantity}`, {
    method: 'POST'
  })
}

export function deleteCartItem(userId, cartItemId) {
  const uId = encodeURIComponent(userId)
  return requestJson(`/api/cart/item/${cartItemId}?userId=${uId}`, { method: 'DELETE' })
}

/**
 * Aktualisiert die Menge eines Items. 
 * Falls dein Backend die variantId im Pfad nicht findet, 
 * prüfe ob dort die 'cartItemId' stehen muss.
 */
export function updateCartItemQuantity(userId, variantId, newQuantity) {
  const uId = encodeURIComponent(userId);
  // Korrektur: Nutzt requestJson statt axios
  return requestJson(`/api/cart/item/${variantId}/quantity?userId=${uId}&quantity=${newQuantity}`, {
    method: 'PUT'
  });
}

// --- ADRESSEN (MIT ENCODING) ---

export function fetchAddressByUserId(userId) {
  return getJson(`/api/addresses/user/${encodeURIComponent(userId)}`)
}

export function fetchAddressByUserAndType(userId, type) {
  return getJson(`/api/addresses/user/${encodeURIComponent(userId)}?type=${type}`)
}

export function fetchAddressById(id) {
  return getJson(`/api/addresses/${id}`)
}

export function saveAddress(payload) {
  return requestJson('/api/addresses', { method: 'POST', body: JSON.stringify(payload) })
}

export function deleteAddress(id) {
  return requestJson(`/api/addresses/${id}`, { method: 'DELETE' })
}