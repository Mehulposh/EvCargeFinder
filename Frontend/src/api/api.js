import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000/api',
});

// Auto-attach JWT — check admin token first, then user token
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect on auth failure — send admin to /alogin, user to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAdminRoute = error.config?.url?.startsWith('/admin');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');

      window.location.href = isAdminRoute ? '/alogin' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;