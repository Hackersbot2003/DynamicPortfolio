import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ||"/api" });
api.interceptors.request.use(c => {
  const t = localStorage.getItem('p_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('p_token');
    if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login'))
      window.location.href = '/admin/login';
  }
  return Promise.reject(err);
});
export default api;
