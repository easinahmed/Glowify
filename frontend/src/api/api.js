import axios from 'axios'

const API_BASE_URL =  'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Auth API
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const signupUser = async (userData) => {
  const response = await api.post('/auth/signup', userData)
  return response.data
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// Product API
export const fetchProducts = async ({ category, maxPrice, search, sort } = {}) => {
  const params = {}
  if (category) params.category = category
  if (maxPrice) params.maxPrice = maxPrice
  if (search) params.search = search
  if (sort) params.sort = sort

  const response = await api.get('/products', { params })
  return response.data
}

export const fetchProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`)
  return response.data
}

export const fetchCategories = async () => {
  const response = await api.get('/products/categories')
  return response.data
}

export const seedProducts = async () => {
  const response = await api.post('/products/seed')
  return response.data
}

export const addProduct = async (productData) => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData)
  return response.data
}

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`)
  return response.data
}

// Order API
export const fetchOrders = async () => {
  const response = await api.get('/orders')
  return response.data
}

export const fetchOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status })
  return response.data
}

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/${orderId}`)
  return response.data
}

export const fetchOrderStats = async () => {
  const response = await api.get('/orders/stats')
  return response.data
}

// Customer API
export const fetchCustomers = async () => {
  const response = await api.get('/customers')
  return response.data
}

export const fetchCustomerById = async (customerId) => {
  const response = await api.get(`/customers/${customerId}`)
  return response.data
}

export const createCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData)
  return response.data
}

export const updateCustomer = async (customerId, customerData) => {
  const response = await api.put(`/customers/${customerId}`, customerData)
  return response.data
}

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/customers/${customerId}`)
  return response.data
}

export const fetchCustomerStats = async () => {
  const response = await api.get('/customers/stats')
  return response.data
}

export default api
