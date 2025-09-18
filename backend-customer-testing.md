# Customer Backend API Testing Guide

## 🔥 JAK Frozen Haven - Customer Backend Implementation Complete

### Overview

The customer backend has been successfully implemented with the following core APIs:

- ✅ Product Catalog with Search & Filtering
- ✅ Guest Order Creation & Processing
- ✅ Order Tracking System
- ✅ Kowri Payment Gateway Integration
- ✅ Customer Contact & Support System
- ✅ Category Management for Filtering

---

## 📋 API Endpoints Summary

### 1. Product Catalog API

**Endpoint**: `GET /api/products`

**Features**:

- Pagination support
- Category filtering
- Search functionality
- Stock availability checking
- Price formatting for display

**Query Parameters**:

```
?category=meat&search=chicken&page=1&limit=20&sortBy=price&sortOrder=asc
```

**Response Structure**:

```json
{
  "success": true,
  "products": [...],
  "pagination": {...},
  "categories": [...],
  "filters": {...}
}
```

### 2. Categories API

**Endpoint**: `GET /api/categories`

**Features**:

- Active categories only
- Product count per category
- Formatted for frontend display

### 3. Order Management APIs

#### Create Order

**Endpoint**: `POST /api/orders`

**Required Fields**:

```json
{
  "customerName": "John Doe",
  "customerPhone": "+233123456789",
  "customerEmail": "john@example.com",
  "deliveryAddress": "123 Main St, Accra",
  "items": [
    {
      "productId": "product_id",
      "title": "Product Name",
      "price": 100,
      "quantity": 2
    }
  ],
  "subtotal": 200,
  "deliveryFee": 20,
  "total": 220,
  "specialInstructions": "Optional instructions"
}
```

#### Track Orders

**Endpoint**: `GET /api/orders?phone=+233123456789`
**Endpoint**: `GET /api/orders?email=john@example.com`
**Endpoint**: `GET /api/orders?orderId=ORD-123456`

#### Individual Order Details

**Endpoint**: `GET /api/orders/[orderId]`

**Features**:

- Complete order timeline
- Product details for each item
- Estimated delivery calculation
- Payment status tracking

### 4. Payment Integration

#### Initialize Payment

**Endpoint**: `POST /api/payment/initialize`

**Payload**:

```json
{
  "orderId": "ORD-123456",
  "amount": 220,
  "customerEmail": "john@example.com",
  "customerPhone": "+233123456789",
  "customerName": "John Doe"
}
```

#### Payment Callback

**Endpoint**: `POST /api/payment/callback`

**Features**:

- Automatic order status updates
- Payment verification
- Admin notifications
- Customer notifications

#### Payment Verification

**Endpoint**: `GET /api/payment/callback?reference=payment_reference`

### 5. Customer Support

#### Contact Form

**Endpoint**: `POST /api/contact`

**Payload**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+233123456789",
  "subject": "Order Inquiry",
  "message": "I have a question about my order",
  "orderId": "ORD-123456",
  "type": "order_inquiry"
}
```

#### Newsletter Subscription

**Endpoint**: `PUT /api/contact`

**Payload**:

```json
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

---

## 🧪 Testing Scenarios

### 1. Product Browsing Flow

```bash
# Get all products
curl "http://localhost:3000/api/products"

# Get products by category
curl "http://localhost:3000/api/products?category=meat"

# Search products
curl "http://localhost:3000/api/products?search=chicken"

# Get categories
curl "http://localhost:3000/api/categories"
```

### 2. Complete Order Flow

```bash
# Step 1: Create Order
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+233123456789",
    "customerEmail": "test@example.com",
    "deliveryAddress": "Test Address, Accra",
    "items": [
      {
        "productId": "test_product_id",
        "title": "Test Product",
        "price": 100,
        "quantity": 2
      }
    ],
    "subtotal": 200,
    "deliveryFee": 20,
    "total": 220
  }'

# Step 2: Initialize Payment
curl -X POST "http://localhost:3000/api/payment/initialize" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "returned_order_id",
    "amount": 220,
    "customerEmail": "test@example.com",
    "customerPhone": "+233123456789",
    "customerName": "Test Customer"
  }'

# Step 3: Track Order
curl "http://localhost:3000/api/orders?phone=+233123456789"

# Step 4: Get Order Details
curl "http://localhost:3000/api/orders/ORD-123456"
```

### 3. Customer Support Flow

```bash
# Submit Contact Form
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "test@example.com",
    "subject": "Test Inquiry",
    "message": "This is a test message"
  }'

# Subscribe to Newsletter
curl -X PUT "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Customer"
  }'
```

---

## 🔧 Integration Features

### Automatic Stock Management

- Stock levels automatically decrease when orders are placed
- Stock movements are logged for admin tracking
- Out-of-stock products are marked appropriately

### Customer Record Management

- Customer profiles are automatically created/updated during checkout
- Order history is maintained per customer
- Contact preferences are stored

### Admin Notifications

- Real-time alerts for new orders
- Payment status notifications
- Customer inquiry alerts
- Low stock alerts

### Firebase Integration

- All data stored in Firestore collections
- Real-time updates supported
- Secure access with proper rules

---

## 🚀 Deployment Readiness

### Environment Variables Required

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Kowri Payment Gateway
NEXT_PUBLIC_KOWRI_APP_REFERENCE=
NEXT_PUBLIC_KOWRI_SECRET=
NEXT_PUBLIC_KOWRI_APP_ID=
NEXT_PUBLIC_KOWRI_BASE_URL=

# Application
NEXT_PUBLIC_APP_URL=
```

### Frontend Integration Points

The APIs are ready for frontend integration with:

- React/Next.js components
- State management (Context API/Redux)
- Form handling and validation
- Payment flow integration
- Real-time order tracking

---

## ✅ Completed Features

1. **✅ Guest Checkout System**

   - No registration required
   - Customer data collection during checkout
   - Automatic customer profile creation

2. **✅ Order Processing**

   - Complete order validation
   - Stock checking and reservation
   - Order status workflow
   - Timeline tracking

3. **✅ Payment Integration**

   - Kowri gateway setup
   - Payment initialization
   - Callback handling
   - Status verification

4. **✅ Product Management**

   - Public product catalog
   - Search and filtering
   - Category management
   - Stock availability

5. **✅ Customer Support**

   - Contact form processing
   - Inquiry management
   - Newsletter subscription
   - Priority assignment

6. **✅ Notifications System**
   - Admin alerts
   - Customer communications
   - Notification logging
   - Status tracking

---

## 🔄 Next Steps for Frontend

1. **Update Product Components**

   - Connect to new API endpoints
   - Implement search/filter UI
   - Add pagination controls

2. **Implement Checkout Flow**

   - Customer information forms
   - Order summary display
   - Payment integration UI

3. **Order Tracking Interface**

   - Order lookup by phone/email
   - Order details display
   - Status timeline UI

4. **Customer Support Forms**
   - Contact form implementation
   - Newsletter signup
   - Inquiry status tracking

**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Status**: Customer Backend Implementation Complete ✅
