// Base backend URL: defaults to Render production URL when running on Vercel or in production
export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? 'https://colorlex-creation.onrender.com' : '')
).replace(/\/$/, '');

export const API_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

export const getAuthToken = () =>
  localStorage.getItem('colorlex_token') || localStorage.getItem('colorlex_admin_token');

/**
 * Resolves static media and uploads to the live backend server
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = BACKEND_URL || (import.meta.env.PROD ? 'https://colorlex-creation.onrender.com' : '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * Robust fetch wrapper handling token authentication, JSON parsing, and Render cold-start responses
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url =
    endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text || `Request failed with status ${res.status}` };
    }

    if (!res.ok) {
      throw new Error(data.message || `API request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
};
