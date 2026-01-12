

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


export function fetchCategories() {
  return getJson('/api/categories')
}

export function createCategory(payload) {
  return requestJson('/api/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchCategoryById(id) {
  return getJson(`/api/categories/${id}`)
}



export function updateCategory(id, payload) {
  return requestJson(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}


export function deleteCategory(id) {
  return requestJson(`/api/categories/${id}`, {
    method: 'DELETE'
  })
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




export function createProduct(payload) {
  return requestJson('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}


export function updateProduct(id, payload) {
  return requestJson(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}


export function deleteProduct(id) {
  return requestJson(`/api/products/${id}`, {
    method: 'DELETE'
  })
}


export function createVariant(productId, payload) {
  return requestJson(`/api/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateVariant(id, payload) {
  return requestJson(`/api/variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}


export function deleteVariant(id) {
  return requestJson(`/api/variants/${id}`, {
    method: 'DELETE'
  })
}


export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('Upload error', res.status, text)
    throw new Error(`Upload failed: ${res.status}`)
  }

  return res.json() 
}

// Ändere dies:
export async function fetchUsers(params = {}) {
  const qs = new URLSearchParams()
  if (params.firstName) qs.set('firstName', params.firstName)
  if (params.lastName) qs.set('lastName', params.lastName)
  if (params.email) qs.set('email', params.email)
  if (params.role) qs.set('role', params.role)

  // FALSCH: fetch(`/api/users?...`) -> geht an Port 5173
  // RICHTIG: Nutze deine getJson Funktion!
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return getJson(`/api/users${query}`) 
}

// Mache das gleiche für die anderen User-Funktionen:
export function fetchUserById(id) {
  return getJson(`/api/users/${id}`)
}

export function deleteUser(id) {
  return requestJson(`/api/users/${id}`, { method: 'DELETE' })
}

export function updateUser(id, payload) {
  return requestJson(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

}

// --- WARENKORB FUNKTIONEN ---

/**
 * Holt den Warenkorb eines Users anhand der ID
 */
export function fetchCartByUserId(userId) {
  return getJson(`/api/cart?userId=${userId}`)
}

/**
 * Fügt ein Produkt mit einer bestimmten Variante zum Warenkorb hinzu
 */
export function addToCart(userId, productId, variantId, quantity) {
  // Wir nutzen requestJson, da es ein POST ist
  // Die Parameter werden als Query-Strings angehängt, wie im Controller definiert
  return requestJson(`/api/cart/add?userId=${userId}&productId=${productId}&variantId=${variantId}&quantity=${quantity}`, {
    method: 'POST'
  })
}

/**
 * Löscht ein spezifisches Item aus dem Warenkorb
 */
export function deleteCartItem(userId, cartItemId) {
  return requestJson(`/api/cart/item/${cartItemId}?userId=${userId}`, {
    method: 'DELETE'
  })
}

/**
 * Optional: Aktualisiert die Menge eines Items direkt
 */
export function updateCartItemQuantity(userId, cartItemId, newQuantity) {
  return requestJson(`/api/cart/item/${cartItemId}/quantity?userId=${userId}&quantity=${newQuantity}`, {
    method: 'PUT'
  })

}

// --- ADRESS FUNKTIONEN ---

/**
 * Holt die Adresse eines Users anhand seiner ID.
 * Falls keine Adresse existiert, wird ein Fehler (404) geworfen, 
 * den wir in der Komponente abfangen können.
 */
export function fetchAddressByUserId(userId) {
  return getJson(`/api/addresses/user/${userId}`)
}

/**
 * Erstellt eine neue Adresse oder aktualisiert eine bestehende.
 * Im Backend sollte ein POST auf /api/addresses beides handhaben können.
 */
export function saveAddress(payload) {
  return requestJson('/api/addresses', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Holt eine spezifische Adresse anhand ihrer ID
 */
export function fetchAddressById(id) {
  return getJson(`/api/addresses/${id}`)
}

// In deiner api.js hinzufügen oder anpassen:
export function fetchAddressByUserAndType(userId, type) {
  // Wir hängen den Typ als Query-Parameter an
  return getJson(`/api/addresses/user/${userId}?type=${type}`)
}

/**
 * Löscht eine Adresse
 */
export function deleteAddress(id) {
  return requestJson(`/api/addresses/${id}`, {
    method: 'DELETE'
  })
}
