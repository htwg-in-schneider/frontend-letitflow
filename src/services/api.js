import {authFetch} from '@/api/authFetch'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:8081'


async function getJson(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {'Content-Type': 'application/json'},
        ...options
    })
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }
    return res.json()
}

async function requestJson(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {'Content-Type': 'application/json'},
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

export function fetchCategoryById(id) {
    return getJson(`/api/categories/${id}`)
}

export function createCategory(payload) {
    return authFetch('/api/categories', {method: 'POST', body: JSON.stringify(payload)})
}

export function updateCategory(id, payload) {
    return authFetch(`/api/categories/${id}`, {method: 'PUT', body: JSON.stringify(payload)})
}

export function deleteCategory(id) {
    return authFetch(`/api/categories/${id}`, {method: 'DELETE'})
}


export function fetchProducts(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.append(key, value)
    })
    const query = params.toString()
    return getJson(query ? `/api/products?${query}` : '/api/products')
}

export function fetchProductById(id) {
    return getJson(`/api/products/${id}`)
}

export function fetchProductVariants(id) {
    return getJson(`/api/products/${id}/variants`)
}

export function createProduct(payload) {
    return authFetch('/api/products', {method: 'POST', body: JSON.stringify(payload)})
}

export function updateProduct(id, payload) {
    return authFetch(`/api/products/${id}`, {method: 'PUT', body: JSON.stringify(payload)})
}

export function deleteProduct(id) {
    return authFetch(`/api/products/${id}`, {method: 'DELETE'})
}


export function createVariant(productId, payload) {
    return authFetch(`/api/products/${productId}/variants`, {method: 'POST', body: JSON.stringify(payload)})
}

export function updateVariant(id, payload) {
    console.log('updateVariant API call:', id, payload)
    return authFetch(`/api/variants/${id}`, {method: 'PUT', body: JSON.stringify(payload)})
}

export function deleteVariant(id) {
    return authFetch(`/api/variants/${id}`, {method: 'DELETE'})
}

export function fetchVariantById(id) {
    return getJson(`/api/variants/${id}`)
}


export async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_BASE_URL}/api/upload`, {method: 'POST', body: formData})
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    return res.json()
}


export function fetchUsers(params = {}) {
    const qs = new URLSearchParams()
    if (params.firstName) qs.set('firstName', params.firstName)
    if (params.lastName) qs.set('lastName', params.lastName)
    if (params.email) qs.set('email', params.email)
    if (params.role) qs.set('role', params.role)
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return authFetch(`/api/users${query}`)
}

export function fetchUserById(id) {
    return authFetch(`/api/users/${id}`)
}

export function updateUser(id, payload) {
    return authFetch(`/api/users/${id}`, {method: 'PUT', body: JSON.stringify(payload)})
}

export function deleteUser(id) {
    return authFetch(`/api/users/${id}`, {method: 'DELETE'})
}

export function fetchCurrentUser() {
    return authFetch('/api/users/me')
}


export function fetchCartByUserId(userId) {
    return authFetch(`/api/cart?userId=${encodeURIComponent(userId)}`)
}

export function addToCart(userId, productId, variantId, quantity) {
    const uId = encodeURIComponent(userId)
    return authFetch(`/api/cart/add?userId=${uId}&productId=${productId}&variantId=${variantId}&quantity=${quantity}`, {
        method: 'POST'
    })
}

export function deleteCartItem(userId, cartItemId) {
    const uId = encodeURIComponent(userId)
    return authFetch(`/api/cart/item/${cartItemId}?userId=${uId}`, {method: 'DELETE'})
}

export function updateCartItemQuantity(userId, variantId, newQuantity) {
    const uId = encodeURIComponent(userId);
    return authFetch(`/api/cart/item/${variantId}/quantity?userId=${uId}&quantity=${newQuantity}`, {
        method: 'PUT'
    });
}

export function clearCart(userId) {
    const uId = encodeURIComponent(userId);
    return authFetch(`/api/cart/clear?userId=${uId}`, {method: 'DELETE'});
}


export function createOrder(payload) {
    return authFetch('/api/orders', {method: 'POST', body: JSON.stringify(payload)})
}

export function fetchAllOrders() {

    return authFetch('/api/orders')
}

export function searchOrders(params = {}) {
    const qs = new URLSearchParams()
    if (params.customerName) qs.set('customerName', params.customerName)
    if (params.userId) qs.set('userId', params.userId)
    if (params.status) qs.set('status', params.status)
    if (params.startDate) qs.set('startDate', params.startDate)
    if (params.endDate) qs.set('endDate', params.endDate)
    if (params.minAmount) qs.set('minAmount', params.minAmount)
    if (params.maxAmount) qs.set('maxAmount', params.maxAmount)
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return authFetch(`/api/orders/search${query}`)
}

export function getOrdersByOauthId(oauthId) {
    return authFetch(`/api/orders/user/${encodeURIComponent(oauthId)}`)
}


export function fetchAddressByUserId(userId) {

    return authFetch(`/api/addresses`)
}

export function fetchAddressByUserAndType(type) {
    return authFetch(`/api/addresses?type=${type}`)
}

export function fetchAddressById(id) {
    return authFetch(`/api/addresses/${id}`)
}

export function saveAddress(payload) {
    return authFetch('/api/addresses', {method: 'POST', body: JSON.stringify(payload)})
}

export function deleteAddress(id) {
    return authFetch(`/api/addresses/${id}`, {method: 'DELETE'})
}

export function fetchOrdersByUserId(userId) {
    return authFetch(`/api/orders/user/${encodeURIComponent(userId)}`, {method: 'GET'})
}

export function fetchOrderById(orderId) {
    return authFetch(`/api/orders/${orderId}`, {method: 'GET'})
}

export function fetchOrderDetailsByOrderId(orderId) {
    return authFetch(`/api/order-details/order/${orderId}`, {method: 'GET'})
}