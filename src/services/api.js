// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

// Alle Kategorien
export function fetchCategories() {
  return getJson('/api/categories');
}

// Produkte mit optionalen Filtern
export function fetchProducts({ name, categorySlug } = {}) {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (categorySlug) params.append('categorySlug', categorySlug);

  const query = params.toString();
  const path = query ? `/api/products?${query}` : '/api/products';
  return getJson(path);
}

// Einzelnes Produkt
export function fetchProductById(id) {
  return getJson(`/api/products/${id}`);
}

// Varianten zu einem Produkt
export function fetchProductVariants(id) {
  return getJson(`/api/products/${id}/variants`);
}
