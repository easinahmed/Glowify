import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import ErrorPage from './pages/ErrorPage';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import Cart from './pages/Cart';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import Customers from './pages/admin/Customers';
import Inventory from './pages/admin/Inventory';


const router = createBrowserRouter([
  {
    path: "/auth",
    Component: () => (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: "login", Component: Login },
      { path: "signup", Component: Signup }
    ]
  },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "orders", Component: AdminOrders },
      { path: "customers", Component: Customers },
      { path: "inventory", Component: Inventory },
    ]
  },
  {
    path: "/",
    Component: () => (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Home },
      { path: "/shop", Component: Shop },
      { path: "/shop/:id", Component: ProductDetails },
      { path: "/user/cart", Component: Cart },
      { path: "/user/dashboard", Component: Dashboard },
    ]
  },
  { path: "*", Component: ErrorPage }
]);


const App = () => {
  return (
   <RouterProvider router={router} />
  )
}

export default App