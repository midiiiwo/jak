# 🔥 Firebase Setup Guide for JAK (Frozen Haven) E-commerce

This guide will walk you through setting up Firebase for the JAK e-commerce platform, including Authentication, Firestore Database, Storage, and all necessary configurations.

## 📋 Prerequisites

- A Google account
- Node.js installed on your machine
- JAK project cloned and set up locally

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**

   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project"
   - Enter project name: `jak-frozen-haven` (or your preferred name)
   - Continue through the setup wizard
   - Choose your analytics preferences
   - Click "Create project"

## 🔐 Step 2: Set Up Authentication

1. **Enable Authentication**

   - In your Firebase console, click "Authentication" from the sidebar
   - Click "Get started"

2. **Configure Sign-in Methods**

   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider
   - Click "Save"

3. **Add Admin User**
   - Go to "Users" tab
   - Click "Add user"
   - Enter admin email and password
   - Note down the User UID for later configuration

## 🗄️ Step 3: Set Up Firestore Database

1. **Create Firestore Database**

   - Click "Firestore Database" from sidebar
   - Click "Create database"
   - Choose "Start in test mode" (we'll configure security rules later)
   - Select your preferred location
   - Click "Done"

2. **Create Collections Structure**
   Create the following collections with the structure below:

   ### 📦 Products Collection

   ```javascript
   // Collection: products
   {
     id: "product_id",
     title: "Product Name",
     description: "Product description",
     price: 100,
     category: "meat", // meat, seafood, poultry
     status: "active", // active, inactive
     stock: 50,
     minStockLevel: 10,
     images: ["url1", "url2"],
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

   ### 📋 Categories Collection

   ```javascript
   // Collection: categories
   {
     id: "category_id",
     name: "Category Name",
     description: "Category description",
     status: "active", // active, inactive
     productCount: 0,
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

   ### 🛒 Orders Collection

   ```javascript
   // Collection: orders
   {
     id: "order_id",
     customerId: "customer_id",
     customerName: "Customer Name",
     customerPhone: "+233123456789",
     customerEmail: "customer@email.com",
     deliveryAddress: "Full address",
     items: [
       {
         productId: "product_id",
         title: "Product Name",
         price: 100,
         quantity: 2
       }
     ],
     subtotal: 200,
     deliveryFee: 20,
     total: 220,
     status: "pending", // pending, confirmed, preparing, delivered, cancelled
     paymentStatus: "pending", // pending, paid, failed
     paymentMethod: "kowri",
     transactionId: "txn_id",
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

   ### 👥 Customers Collection

   ```javascript
   // Collection: customers
   {
     id: "customer_id",
     name: "Customer Name",
     email: "customer@email.com",
     phone: "+233123456789",
     address: "Customer address",
     totalOrders: 0,
     totalSpent: 0,
     status: "active", // active, inactive
     createdAt: timestamp,
     lastOrderAt: timestamp
   }
   ```

   ### 📊 Stock Movements Collection

   ```javascript
   // Collection: stock_movements
   {
     id: "movement_id",
     productId: "product_id",
     type: "in", // in, out, adjustment
     quantity: 10,
     reason: "purchase", // purchase, sale, adjustment, damage
     notes: "Optional notes",
     performedBy: "admin_id",
     createdAt: timestamp
   }
   ```

   ### 🔔 Admin Alerts Collection

   ```javascript
   // Collection: admin_alerts
   {
     id: "alert_id",
     message: "Alert message",
     category: "inventory", // order, inventory, customer, system, payment
     priority: "high", // low, medium, high
     isRead: false,
     metadata: {
       productId: "product_id",
       orderId: "order_id"
     },
     createdAt: timestamp,
     expiresAt: timestamp
   }
   ```

   ### 📝 Notification Logs Collection

   ```javascript
   // Collection: notification_logs
   {
     id: "log_id",
     type: "email", // email, sms, push, admin_alert
     recipient: "email@example.com",
     subject: "Email subject",
     message: "Notification message",
     status: "sent", // sent, failed, pending
     sentAt: timestamp,
     error: "Error message if failed",
     createdAt: timestamp
   }
   ```

## 📁 Step 4: Set Up Storage

1. **Enable Storage**

   - Click "Storage" from sidebar
   - Click "Get started"
   - Choose "Start in test mode"
   - Select your preferred location
   - Click "Done"

2. **Create Folder Structure**
   - In the Storage browser, create the following folder structure:
   ```
   /products/
     ├── [product-id]/
     │   ├── image1.jpg
     │   ├── image2.jpg
     │   └── ...
     ├── [another-product-id]/
     └── ...
   ```

## ⚙️ Step 5: Configure Environment Variables

1. **Get Firebase Configuration**

   - In Firebase console, go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Add app" and choose Web (< />)
   - Register your app with name: "JAK Frontend"
   - Copy the configuration object

2. **Get Service Account Key**

   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Download the JSON file (keep it secure!)

3. **Set Up Environment Variables**
   Create a `.env.local` file in your project root:

   ```env
   # Firebase Configuration (Client-side)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Admin Configuration
   NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com,admin2@example.com
   NEXT_PUBLIC_ADMIN_UID=admin_uid_1,admin_uid_2

   # Firebase Admin SDK (Server-side)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

   # JWT Secret for Admin Authentication
   JWT_SECRET=your_super_secret_jwt_key_here

   # Kowri Payment Gateway (if using)
   KOWRI_PUBLIC_KEY=your_kowri_public_key
   KOWRI_SECRET_KEY=your_kowri_secret_key
   KOWRI_ENDPOINT=https://api.kowri.io

   # Email Service (Optional - for notifications)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com

   # SMS Service (Optional - for notifications)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## 🔒 Step 6: Configure Security Rules

### Firestore Security Rules

Go to Firestore > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Read for everyone, write for admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Categories - Read for everyone, write for admins only
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Orders - Admin can read/write all, customers can read their own
    match /orders/{orderId} {
      allow read, write: if isAdmin();
      allow read: if isOwner(resource.data.customerId);
    }

    // Customers - Admin can read/write all
    match /customers/{customerId} {
      allow read, write: if isAdmin();
    }

    // Stock movements - Admin only
    match /stock_movements/{movementId} {
      allow read, write: if isAdmin();
    }

    // Admin alerts - Admin only
    match /admin_alerts/{alertId} {
      allow read, write: if isAdmin();
    }

    // Notification logs - Admin only
    match /notification_logs/{logId} {
      allow read, write: if isAdmin();
    }

    // Helper functions
    function isAdmin() {
      return request.auth != null &&
             (request.auth.uid in ['admin_uid_1', 'admin_uid_2'] ||
              request.auth.token.email in ['admin@example.com', 'admin2@example.com']);
    }

    function isOwner(customerId) {
      return request.auth != null && request.auth.uid == customerId;
    }
  }
}
```

### Storage Security Rules

Go to Storage > Rules and update with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - Read for everyone, write for admins only
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null &&
             (request.auth.uid in ['admin_uid_1', 'admin_uid_2'] ||
              request.auth.token.email in ['admin@example.com', 'admin2@example.com']);
    }
  }
}
```

## 🎯 Step 7: Test Configuration

1. **Test Authentication**

   ```bash
   npm run dev
   ```

   - Navigate to `/admin/login`
   - Try logging in with your admin credentials

2. **Test Database Connection**

   - Navigate to `/admin`
   - Check if dashboard loads properly
   - Try creating a product or category

3. **Test Storage**
   - Try uploading product images
   - Verify images appear in Firebase Storage

## 🔧 Step 8: Production Setup

### Update Security Rules for Production

1. **Remove Test Mode**

   - Update Firestore and Storage rules to remove any test mode configurations
   - Ensure proper authentication checks are in place

2. **Environment Variables for Production**

   ```env
   # Production environment variables
   NODE_ENV=production

   # Update with production Firebase project
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
   # ... other production Firebase configs
   ```

3. **Admin User Management**
   - Create production admin users
   - Update admin UIDs and emails in environment variables
   - Remove any test admin accounts

## 📊 Step 9: Initialize Sample Data (Optional)

Run the sample data script to populate your database:

```bash
# Create and run the initialization script
node scripts/init-sample-data.js
```

Sample script content:

```javascript
// scripts/init-sample-data.js
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function initSampleData() {
  // Add sample categories
  const categories = [
    { name: "Meat", description: "Fresh meat products", status: "active" },
    {
      name: "Seafood",
      description: "Fresh seafood products",
      status: "active",
    },
    {
      name: "Poultry",
      description: "Fresh poultry products",
      status: "active",
    },
  ];

  for (const category of categories) {
    await db.collection("categories").add({
      ...category,
      productCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Add sample products
  const products = [
    {
      title: "Fresh Chicken",
      description: "Whole fresh chicken, perfect for roasting",
      price: 200,
      category: "poultry",
      status: "active",
      stock: 50,
      minStockLevel: 10,
      images: [],
    },
    {
      title: "Salmon Fillet",
      description: "Premium salmon fillet, rich in omega-3",
      price: 350,
      category: "seafood",
      status: "active",
      stock: 30,
      minStockLevel: 5,
      images: [],
    },
    {
      title: "Beef Steak",
      description: "Premium beef steak, tender and juicy",
      price: 400,
      category: "meat",
      status: "active",
      stock: 25,
      minStockLevel: 5,
      images: [],
    },
  ];

  for (const product of products) {
    await db.collection("products").add({
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("Sample data initialized successfully!");
}

initSampleData().catch(console.error);
```

## 🚨 Troubleshooting

### Common Issues

1. **Authentication not working**

   - Check if admin email/UID is correctly set in environment variables
   - Verify Firebase configuration is correct
   - Check browser console for errors

2. **Database connection fails**

   - Verify service account key is properly formatted
   - Check Firestore security rules
   - Ensure project ID matches

3. **Storage upload fails**

   - Check Storage security rules
   - Verify admin authentication
   - Check file size limits

4. **Environment variables not loading**
   - Restart the development server
   - Check `.env.local` file format
   - Verify variable names match exactly

### Support

If you encounter issues:

1. Check Firebase console for error logs
2. Review browser console for client-side errors
3. Check server logs for API errors
4. Verify all configuration steps were followed

## ✅ Completion Checklist

- [ ] Firebase project created
- [ ] Authentication configured with admin user
- [ ] Firestore database set up with collections
- [ ] Storage enabled and configured
- [ ] Environment variables configured
- [ ] Security rules updated
- [ ] Sample data initialized (optional)
- [ ] Authentication tested
- [ ] Database operations tested
- [ ] File upload tested

## 🎉 Success!

Your Firebase setup is now complete! Your JAK e-commerce platform should be fully functional with:

- ✅ Admin authentication working
- ✅ Product management operational
- ✅ Order processing functional
- ✅ Customer management working
- ✅ Inventory tracking active
- ✅ Notifications system ready
- ✅ File upload capabilities enabled

You can now continue with the customer-side implementation or start adding your products!
