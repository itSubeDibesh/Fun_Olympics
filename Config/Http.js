import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';
import express from 'express';
import isLoggedIn from '../Middleware/IsLoggedIn.js'
import Auth from '../Controller/core/Auth_Access_Firebase.js';
import Admin from '../Controller/core/Admin_Access_Firebase.js'
import { Video, User, Profanity, Role, Comments, Archive, Notice } from '../Controller/core/Collections.js'
import { dataSet, returnBool } from './helper.js'

// Enabling dotenv
dotenv.config();

// Firebase Configuration
const firebase_admin = new Admin();

// Setting Firebase Auth
const firebase_auth = new Auth();

// Extracting env variables
const { port, secret, app_name } = process.env;


export default {
    check,
    validationResult,
    express,
    port,
    app_name,
    secret,
    isLoggedIn,
    dataSet,
    returnBool,
    firebase_admin,
    firebase_auth,
    Db_Collection: {
        Video, User, Profanity, Role, Comments, Archive, Notice
    }
}