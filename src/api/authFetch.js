import {auth0} from '../main';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
        const rawText = await response.text().catch(() => '');
        let parsed = {};
        try {
            parsed = rawText ? JSON.parse(rawText) : {};
        } catch (_) {
            parsed = {};
        }
        const error = new Error(parsed.message || rawText || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.responseBody = rawText;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!isJson) {
        return response.text();
    }

    const raw = await response.text();
    try {
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        const parseError = new Error('Konnte JSON nicht parsen');
        parseError.status = response.status;
        parseError.responseBody = raw;
        throw parseError;
    }
}
