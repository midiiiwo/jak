import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const serviceAccount = require('../frozen-haven-firebase-adminsdk-fbsvc-25824a052f.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

async function createAdminUser() {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.argv[2]; // Pass password as command line argument

    if (!adminEmail || !adminPassword) {
        console.error('Admin email and password are required!');
        process.exit(1);
    }

    try {
        // Create the user
        const userRecord = await getAuth().createUser({
            email: adminEmail,
            password: adminPassword,
            emailVerified: true,
        });

        // Set custom claims to mark user as admin
        await getAuth().setCustomUserClaims(userRecord.uid, {
            admin: true
        });

        console.log('Admin user created successfully:', userRecord.uid);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
