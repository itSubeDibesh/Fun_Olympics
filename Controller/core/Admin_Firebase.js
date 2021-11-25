import admin from 'firebase-admin'
import {service_account} from '../../Config/app/service-accountKey.js'


class Admin_Firebase {
    constructor() {
        // Setting Service Account key
        this.service_account = service_account
        // Setting up Firebase
        this.admin = admin
        // Initialize Firebase
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.service_account)
        })
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
}

export default class Auth_Crud extends Admin_Firebase{
    constructor(){
        super()
    }

    createUser(email, password, displayName, phoneNumber){
        return this.getAuth().createUser({
            email: email,
            password: password,
            displayName: displayName,
            phoneNumber: phoneNumber,
            disabled: false,
            emailVerified: false
        })
    }

    updateUser(uid, email, password, displayName,phoneNumber, disabled){
        return this.getAuth().updateUser(uid, {
            email: email,
            password: password,
            displayName: displayName,
            phoneNumber:phoneNumber,
            disabled: disabled,
        })
    }
}