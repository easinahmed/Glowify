# Backend API Documentation

## Overview

This is the Express.js backend for the Glowify storefront application. It provides RESTful APIs for user authentication, product management, order processing, customer management, and shopping cart functionality. The backend uses MongoDB for data storage, JWT for authentication, and supports CORS for frontend integration.

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB (Mongoose)**: Database and ODM
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **cookie-parser**: Cookie handling

## Installation and Setup

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   - `PORT`: Server port (default: 5000)
   - `JWT_SECRET`: Secret key for JWT tokens
   - `FRONTEND_URL`: URL of the frontend application
   - `MONGODB_URI`: MongoDB connection string
   - `NODE_ENV`: Environment (e.g., 'production' or 'development')
4. Start the server:
   - Development: `npm run dev` (uses nodemon)
   - Production: `npm start`

## API Endpoints

### Authentication (`/api/auth`)

- **POST /api/auth/signup**
  - Description: Register a new user account.
  - Body: `{ username, email, password }`
  - Response: User data and sets authentication cookie.

- **POST /api/auth/login**
  - Description: Authenticate and log in a user.
  - Body: `{ email, password }`
  - Response: User data and sets authentication cookie.

- **POST /api/auth/logout**
  - Description: Log out the current user.
  - Requires: Authentication
  - Response: Clears authentication cookie.

- **GET /api/auth/me**
  - Description: Get information about the currently authenticated user.
  - Requires: Authentication
  - Response: Sanitized user data.

### Products (`/api/products`)

- **GET /api/products/seed**
  - Description: Seed the database with sample products.
  - Response: Success message.

- **GET /api/products**
  - Description: Retrieve all products with optional filtering.
  - Query params: category, search, etc.
  - Response: Array of products.

- **GET /api/products/categories**
  - Description: Get unique product categories.
  - Response: Array of category strings.

- **GET /api/products/best-sellers**
  - Description: Get best-selling products.
  - Response: Array of products.

- **GET /api/products/:id**
  - Description: Get a specific product by ID.
  - Params: id (product ID)
  - Response: Product object.

- **POST /api/products**
  - Description: Add a new product (admin functionality).
  - Body: Product data (name, description, category, price, etc.)
  - Response: Created product.

- **PUT /api/products/:id**
  - Description: Update an existing product (admin functionality).
  - Params: id (product ID)
  - Body: Updated product data
  - Response: Updated product.

- **DELETE /api/products/:id**
  - Description: Delete a product (admin functionality).
  - Params: id (product ID)
  - Response: Success message.

### Orders (`/api/orders`)

- **POST /api/orders**
  - Description: Create a new order from the user's cart.
  - Requires: Authentication
  - Body: Order details (items, shipping info, etc.)
  - Response: Created order.

- **GET /api/orders/stats**
  - Description: Get order statistics (total orders, revenue, etc.).
  - Requires: Authentication and admin role
  - Response: Statistics object.

- **GET /api/orders**
  - Description: Get orders (admins see all, users see their own).
  - Requires: Authentication
  - Response: Array of orders.

- **GET /api/orders/:id**
  - Description: Get a specific order by ID.
  - Requires: Authentication
  - Params: id (order ID)
  - Response: Order object.

- **PUT /api/orders/:id/status**
  - Description: Update the status of an order (admin only).
  - Requires: Authentication and admin role
  - Params: id (order ID)
  - Body: `{ status }`
  - Response: Updated order.

- **DELETE /api/orders/:id**
  - Description: Delete an order (admin only).
  - Requires: Authentication and admin role
  - Params: id (order ID)
  - Response: Success message.

### Customers (`/api/customers`)

- **GET /api/customers**
  - Description: Get all customers (admin functionality).
  - Response: Array of customers.

- **GET /api/customers/stats**
  - Description: Get customer statistics.
  - Response: Statistics object.

- **GET /api/customers/:id**
  - Description: Get a specific customer by ID.
  - Params: id (customer ID)
  - Response: Customer object.

- **POST /api/customers**
  - Description: Create a new customer.
  - Body: Customer data
  - Response: Created customer.

- **PUT /api/customers/:id**
  - Description: Update a customer.
  - Params: id (customer ID)
  - Body: Updated customer data
  - Response: Updated customer.

- **DELETE /api/customers/:id**
  - Description: Delete a customer.
  - Params: id (customer ID)
  - Response: Success message.

### Cart (`/api/cart`)

All cart endpoints require authentication.

- **GET /api/cart**
  - Description: Get the current user's shopping cart.
  - Response: Cart object with items.

- **POST /api/cart/add**
  - Description: Add a product to the cart.
  - Body: `{ productId, quantity }`
  - Response: Updated cart.

- **PUT /api/cart/update**
  - Description: Update the quantity of an item in the cart.
  - Body: `{ productId, quantity }`
  - Response: Updated cart.

- **DELETE /api/cart/remove/:productId**
  - Description: Remove a product from the cart.
  - Params: productId
  - Response: Updated cart.

- **DELETE /api/cart/clear**
  - Description: Clear all items from the cart.
  - Response: Empty cart.

## Authentication and Authorization

- JWT tokens are stored in HTTP-only cookies for security.
- Protected routes require a valid token.
- Admin-only routes check for `role: 'admin'` in the token payload.
- CORS is configured to allow requests from the specified frontend URL with credentials.

## Error Handling

The API returns standard HTTP status codes and JSON error messages for invalid requests, authentication failures, and server errors.

## Database Models

- **User**: Stores user information (username, email, password hash, role, verification status).
- **Product**: Product details (name, description, category, price, image, stock, slug).
- **Order**: Order information (user, items, total, status, shipping details).
- **Customer**: Customer data (may overlap with User or be separate).
- **Cart**: User's shopping cart (user reference, items array).

For detailed schema information, refer to the model files in the `models/` directory.
