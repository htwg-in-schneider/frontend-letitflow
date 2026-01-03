
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




