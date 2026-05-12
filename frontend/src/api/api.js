import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})


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

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart')
  return response.data
}

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart/add', { productId, quantity })
  return response.data
}

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put('/cart/update', { productId, quantity })
  return response.data
}

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/remove/${productId}`)
  return response.data
}

export const clearCart = async () => {
  const response = await api.delete('/cart/clear')
  return response.data
}
  
// Product API
export const fetchProducts = async (params = {}) => {
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

export const fetchBestSellers = async (limit = 4) => {
  const response = await api.get('/products/best-sellers', { params: { limit } })
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
