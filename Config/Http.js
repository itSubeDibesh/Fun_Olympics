import dotenv from 'dotenv';
import {check, validationResult} from 'express-validator';
import express from 'express';
import isLoggedIn from '../Middleware/IsLoggedIn.js'
import Auth_Firebase from '../Controller/core/Auth_Firebase.js';
import Admin_Firebase from '../Controller/core/Admin_Firebase.js'

// Enabling dotenv
dotenv.config();

// Firebase Configuration
const firebase_admin = new Admin_Firebase();

// Extracting env variables
const {port,secret, app_name} = process.env;

// Defining Dataset
function dataSet(data) {
    data.app_name = app_name;
    return data;
}

function returnBool(data){
    return data == 'true'
}

export default {
    check,
    validationResult,
    express,
    port,
    app_name,
    secret,
    isLoggedIn,
    Auth_Firebase,
    Admin_Firebase,
    dataSet,
    returnBool,
    firebase_admin
}