import { auth0 } from '../main';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function authFetch(path, options = {}) {
  const token = await auth0.getAccessTokenSilently();

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
