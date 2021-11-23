import dotenv from 'dotenv';
import {check, validationResult} from 'express-validator';
import express from 'express';
import { initializeApp} from 'firebase/app'

// Enabling dotenv
dotenv.config();

// Extracting env variables
const {port,apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,secret, app_name, sessionMaxAge} = process.env;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQqwBkeoEdR0yyw1XYVNerAYTAr__HNL8",
    authDomain: "fun-olympics-cet333-2021.firebaseapp.com",
    projectId: "fun-olympics-cet333-2021",
    storageBucket: "fun-olympics-cet333-2021.appspot.com",
    messagingSenderId: "917002592142",
    appId: "1:917002592142:web:95e828ef646ba6e1534edf"
};

export default {
    check,
    validationResult,
    express,
    port,
    app_name,
    secret,
    firebaseConfig,
    sessionMaxAge,
    initializeApp
}