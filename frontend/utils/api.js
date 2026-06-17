const API_BASE = '/api';

async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    credentials: 'include',
    headers: {},
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:logout'))
    throw new Error('Não autenticado')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.erro || data.message || `Erro ${response.status}`);
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json();
  }

  return response;
}

export const get = (endpoint) => api(endpoint, { method: 'GET' });
export const post = (endpoint, body) => api(endpoint, { method: 'POST', body });
export const put = (endpoint, body) => api(endpoint, { method: 'PUT', body });
export const patch = (endpoint, body) => api(endpoint, { method: 'PATCH', body });
export const del = (endpoint) => api(endpoint, { method: 'DELETE' });

export function handleApiError(err, toast) {
  const msg = err.message || 'Erro inesperado';
  if (toast) toast.error(msg);
  else console.error(msg);
}
