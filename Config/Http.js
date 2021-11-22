import dotenv from 'dotenv';
import {check, validationResult} from 'express-validator';
import express from 'express';
import bcrypt from 'bcryptjs';

// Enabling dotenv
dotenv.config();

// Extracting env variables
const {port,apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,secret, app_name} = process.env;

// Firebase Configuration
const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
}
export default {
    check,
    validationResult,
    express,
    bcrypt,
    port,
    app_name,
    secret,
    firebaseConfig
}