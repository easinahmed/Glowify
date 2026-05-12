# Frontend Documentation

## Overview

This is the React frontend for the Glowify storefront application. It provides a user-friendly interface for browsing products, managing shopping carts, placing orders, and administrative functions. The frontend is built with modern React practices, using Vite for fast development and Tailwind CSS for styling.

## Technologies Used

- **React 19**: UI library with hooks and modern features
- **Vite**: Build tool for fast development and optimized production builds
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **@tanstack/react-query**: Data fetching and caching
- **Lucide React**: Icon library
- **ESLint**: Code linting

## Installation and Setup

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   - `VITE_API_BASE_URL`: Base URL of the backend API (e.g., `http://localhost:5000/api`)
4. Start the development server: `npm run dev`
5. Build for production: `npm run build`
6. Preview production build: `npm run preview`

## Features and Pages

### Public Pages

- **Home (/)**: Landing page with hero section, categories, best-sellers, and newsletter signup
- **Shop (/shop)**: Product catalog with filtering and search
- **Product Details (/shop/:id)**: Detailed view of individual products
- **Order Success (/ordersuccess)**: Confirmation page after successful order placement

### Authentication Pages

- **Login (/auth/login)**: User login form
- **Signup (/auth/signup)**: User registration form

### User Dashboard

- **Dashboard (/user/dashboard)**: User profile and order history (accessible to authenticated users)

### Admin Pages (Admin Role Required)

- **Admin Dashboard (/admin/dashboard)**: Overview of store statistics
- **Orders (/admin/orders)**: Manage and view all orders
- **Customers (/admin/customers)**: Customer management
- **Inventory (/admin/inventory)**: Product inventory management

## Authentication and Authorization

- Uses JWT tokens stored in HTTP-only cookies
- `AuthContext` provides authentication state management
- Protected routes redirect unauthenticated users to login
- Role-based access control for admin features
- Automatic redirection based on user role (admins to admin dashboard)

## API Integration

The frontend communicates with the backend API using Axios. Key integrations include:

- **Authentication**: Login, signup, logout, get current user
- **Products**: Fetch products, categories, best-sellers, CRUD operations
- **Cart**: Add, update, remove items, clear cart
- **Orders**: Create orders, fetch order history, admin order management
- **Customers**: Customer data management (admin)

All API calls are handled through the `api.js` file with proper error handling.

## Routing Structure

- **/**: Root route with role-based redirection
- **/shop**: Product browsing
- **/shop/:id**: Product details
- **/auth/login**: Login page
- **/auth/signup**: Signup page
- **/user/dashboard**: User dashboard
- **/admin/**: Admin routes (protected)
- **/ordersuccess**: Order confirmation

## Components Structure

### Layouts

- **MainLayout**: Standard layout with navbar and footer for public pages
- **AuthLayout**: Minimal layout for authentication pages
- **AdminLayout**: Admin-specific layout with sidebar navigation

### Route Guards

- **ProtectedRoute**: Requires authentication, optional role checking
- **PublicRoute**: Redirects authenticated users away from auth pages
- **RequireNonAdminRoute**: Prevents admins from accessing certain public routes

### Sections

- **HeroSection**: Homepage hero banner
- **CategorySection**: Product categories display
- **BestSellingSection**: Featured products
- **NewsLetter**: Email subscription form

### Components

- **Navbar**: Navigation bar with cart, user menu
- **Footer**: Site footer with links
- **AuthContext**: Authentication state provider

## State Management

- **AuthContext**: Manages user authentication state
- **React Query**: Handles server state, caching, and synchronization for API data
- Local component state for UI interactions

## Styling

- **Tailwind CSS**: Utility classes for responsive design
- Custom CSS in `index.css` for global styles
- Responsive design for mobile and desktop

## Performance Optimizations

- **Lazy Loading**: Pages are lazy-loaded for better initial load times
- **React Query**: Intelligent caching and background refetching
- **Vite**: Fast HMR and optimized builds

## Development

- **ESLint**: Code quality and consistency
- **Vite Dev Server**: Fast development with hot module replacement
- **Preview**: Test production builds locally

## Build and Deployment

- Build command: `npm run build`
- Output in `dist/` directory
- Can be deployed to static hosting services like Vercel, Netlify, etc.
- Environment variables configured for different deployment environments
