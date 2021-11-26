import admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { service_account } from '../../Config/app/service-accountKey.js'


export default class FIREBASE_ADMIN {
    constructor() {
        // Setting Service Account key
        this.service_account = service_account
        // Setting up Firebase
        this.admin = admin
        // Initialize Firebase
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.service_account)
        })
        this.FieldValue = FieldValue
    }

    // Get Firebase Admin
    getAdmin() {
        return this.admin
    }

    // Get Firebase Database
    getDatabase() {
        return this.admin.database()
    }

    // Get Firebase Storage
    getStorage() {
        return this.admin.storage()
    }

    // Get Firebase Auth
    getAuth() {
        return this.admin.auth()
    }

    // Get Firebase Messaging
    getMessaging() {
        return this.admin.messaging()
    }

    // Get Firebase Functions
    getFunctions() {
        return this.admin.functions()
    }

    // Get Firebase Hosting
    getHosting() {
        return this.admin.hosting()
    }

    // Get Firebase App
    getApp() {
        return this.admin.app()
    }

    // Get Firestore 
    getFirestore() {
        return this.admin.firestore(this.getApp())
    }
}
