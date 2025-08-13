import axios from 'axios';
import AuthService from './auth.service';

// Create axios instance
const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
      // Show user-friendly error when backend is not running
      console.error('Backend connection failed. Please ensure the backend is running on port 8080.');
      // You can add a toast notification here if you want
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/signin', credentials),
  register: (userData) => apiClient.post('/auth/signup', userData),

  // User endpoints
  getAllUsers: () => apiClient.get('/users'),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),

  // Book endpoints
  getAllBooks: () => apiClient.get('/books'),
  getBookById: (id) => apiClient.get(`/books/${id}`),
  createBook: (bookData) => apiClient.post('/books', bookData),
  updateBook: (id, bookData) => apiClient.put(`/books/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
  searchBooks: (params) => apiClient.get('/books/search', { params }),
  searchBooksByQuery: (query) => apiClient.get('/books/search/query', { params: { q: query } }),

  // Category endpoints
  getAllCategories: () => apiClient.get('/categories'),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  createCategory: (categoryData) => apiClient.post('/categories', categoryData),
  updateCategory: (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
  searchCategories: (params) => apiClient.get('/categories/search', { params }),
  searchCategoriesByQuery: (query) => apiClient.get('/categories/search/query', { params: { q: query } }),
  getActiveCategories: () => apiClient.get('/categories/active'),

  // API endpoints
  getAllApis: () => apiClient.get('/apis'),
  getApiById: (id) => apiClient.get(`/apis/${id}`),
  createApi: (apiData) => apiClient.post('/apis', apiData),
  updateApi: (id, apiData) => apiClient.put(`/apis/${id}`, apiData),
  deleteApi: (id) => apiClient.delete(`/apis/${id}`),
  getActiveApis: () => apiClient.get('/apis/active'),
  getApisByMethod: (method) => apiClient.get(`/apis/method/${method}`),
};

export default ApiService; 