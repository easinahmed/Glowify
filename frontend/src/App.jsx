import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import ErrorPage from './pages/ErrorPage'
import AuthLayout from './layout/AuthLayout'
import MainLayout from './layout/MainLayout'
import Cart from './pages/Cart'
import Dashboard from './pages/user/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import Customers from './pages/admin/Customers'
import Inventory from './pages/admin/Inventory'
import OrderSuccess from './pages/OrderSuccess'

const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'customers', element: <Customers /> },
      { path: 'inventory', element: <Inventory /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:id', element: <ProductDetails /> },
      { path: 'ordersuccess', element: <OrderSuccess /> },
    ]
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'cart', element: <Cart /> },
      { path: 'dashboard', element: <Dashboard /> },
    ]
  },
  { path: '*', element: <ErrorPage /> }
]);

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

export default App