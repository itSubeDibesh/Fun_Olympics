import {firebaseConfig } from '../../Config/app/firebase-configuration.js'
import { initializeApp} from 'firebase/app'
import {
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    sendEmailVerification  ,
    sendPasswordResetEmail,
    updateProfile 
} from "firebase/auth";

export default class Authentication{
    constructor(){
        // Firebase Configuration
        this.firebaseConfig = firebaseConfig;
        // Setting up Firebase
        this.initializeApp = initializeApp
        // Configuring Firebase
        this.initializeApp(this.firebaseConfig);
        this.auth = getAuth();
    }

    login(email, password){
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout(){
        return signOut(this.auth);
    }

    getCurrentUser(){
        return this.auth.currentUser
    }

    verifyEmail(){
        return sendEmailVerification(this.auth.currentUser);
    }

    updateProfile(displayName){
        return updateProfile(this.auth.currentUser, {displayName: displayName});
    }

    resetPassword(email){
        return sendPasswordResetEmail(this.auth,email);
    }

    register(email, password){
        return createUserWithEmailAndPassword(this.auth,email, password);
    }
}