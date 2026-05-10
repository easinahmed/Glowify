import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireNonAdminRoute from './routes/RequireNonAdminRoute';

// Layouts
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';

// Routes Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import AdminLayout from './layout/AdminLayout';

// Lazy Loading Pages (Performance better hobe)
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Loading Component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h3>Loading...</h3>
  </div>
);

// Home ba Root path-e role check korar logic
const RootIndex = () => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  
  // Admin hole admin dashboard-e pathiye dibe, nahole normal home
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Home />;
};

const router = createBrowserRouter([
  // Public & Home Routes
  {
    path: '/',
    element: (
      <RequireNonAdminRoute>
        <MainLayout />
      </RequireNonAdminRoute>
    ),
    children: [
      { index: true, element: <RootIndex /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:id', element: <ProductDetails /> },
      { path: 'ordersuccess', element: <OrderSuccess /> },
    ]
  },

  // Auth Routes (Login/Signup)
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

  // Admin Routes (Protected)
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'customers', element: <Customers /> },
      { path: 'inventory', element: <Inventory /> },
    ]
  },

  // User Private Routes
  {
    path: '/user',
    element: (
      <ProtectedRoute roles={['user']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'cart', element: <Cart /> },
      { path: 'dashboard', element: <Dashboard /> },
    ]
  },

  // 404 Route
  { path: '*', element: <ErrorPage /> }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;