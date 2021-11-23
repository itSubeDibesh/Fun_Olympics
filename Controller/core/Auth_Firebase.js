import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default class Authentication{
    constructor(initializeApp, firebaseConfig){
        // Configuring Firebase
        initializeApp(firebaseConfig);
        this.auth = getAuth();
    }

    login(email, password){
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout(){
        return signOut(this.auth);
    }

    getCurrentUser(){
        return this.auth.currentUser;
    }

    register(email, password){
        return createUserWithEmailAndPassword(this.auth,email, password);
    }
}