import { initializeApp} from 'firebase/app'
import {
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    sendEmailVerification  ,
    sendPasswordResetEmail
} from "firebase/auth";

export default class Authentication{
    constructor(){
        // Firebase Configuration
        this.firebaseConfig = {
            apiKey: "AIzaSyBQqwBkeoEdR0yyw1XYVNerAYTAr__HNL8",
            authDomain: "fun-olympics-cet333-2021.firebaseapp.com",
            projectId: "fun-olympics-cet333-2021",
            storageBucket: "fun-olympics-cet333-2021.appspot.com",
            messagingSenderId: "917002592142",
            appId: "1:917002592142:web:95e828ef646ba6e1534edf"
        };
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

    resetPassword(email){
        return sendPasswordResetEmail(this.auth,email);
    }

    register(email, password){
        return createUserWithEmailAndPassword(this.auth,email, password);
    }
}