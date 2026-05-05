import axios from 'axios';

// DEBUG: check if env is loading
console.log("API URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setupInterceptors = (logout, showToast) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      if (error.response?.status >= 500) {
        showToast('Something went wrong. Please try again.', 'error');
      }
      return Promise.reject(error);
    }
  );
};

export default api;
