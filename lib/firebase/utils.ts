import { db, auth } from './admin';

export const firebaseUtils = {
    // User Management
    async createUser(userData: { email: string; password: string; displayName?: string }) {
        try {
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.displayName
            });
            return userRecord;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Firestore Operations
    async addDocument(collection: string, data: any) {
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    },

    async getDocument(collection: string, docId: string) {
        try {
            const doc = await db.collection(collection).doc(docId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    },

    async updateDocument(collection: string, docId: string, data: any) {
        try {
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    },

    async deleteDocument(collection: string, docId: string) {
        try {
            await db.collection(collection).doc(docId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },

    // Query Operations
    async queryDocuments(collection: string, conditions: Array<{ field: string; operator: string; value: any }>) {
        try {
            let query: FirebaseFirestore.Query = db.collection(collection);

            conditions.forEach(condition => {
                query = query.where(condition.field, condition.operator as FirebaseFirestore.WhereFilterOp, condition.value);
            });

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error;
        }
    }
};
