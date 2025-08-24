import { EventData } from "../models/EventData.js";
import admin from 'firebase-admin';


export function pushEventDataToFirestore(event: EventData, db: admin.firestore.Firestore, collection :string): void {
    try {
        db.collection(collection).add(event);
    }
    catch (error) {
        console.error("Error uploading to Firestore:", error);
    };
}

export function createAdminSdkConnection(serviceAccount: admin.ServiceAccount): typeof admin {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    return admin;
}
