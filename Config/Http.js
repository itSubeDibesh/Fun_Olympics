import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';
import express from 'express';
import isLoggedIn from '../Middleware/IsLoggedIn.js'
import { HasAccess, get_role_permission, Privilege, Roles, Access } from '../Middleware/HasAccess.js'
import Auth from '../Controller/core/Auth_Access_Firebase.js';
import Admin from '../Controller/core/Admin_Access_Firebase.js'
import { Video, User, Profanity, Role, Comments, Reminder, Notice, FAQ } from '../Controller/core/Collections.js'
import { dataSet, returnBool, extractVideoID, random_number, has_profanity } from './helper.js'

// Enabling dotenv
dotenv.config();

// Firebase Configuration
const firebase_admin = new Admin();

// Setting Firebase Auth
const firebase_auth = new Auth();

// Setting Firebase individual tables
const Db_Collection =
{
    Video: new Video(),
    User: new User(),
    Profanity: new Profanity(),
    Role: new Role(),
    Comments: new Comments(),
    Reminder: new Reminder(),
    Notice: new Notice(),
    FAQ: new FAQ()
}

// Extracting env variables
const { port } = process.env;


export default {
    check,
    validationResult,
    express,
    port: port || process.env.PORT,
    app_name : "Fun Olympics",
    secret: "ThisIsMySessionSecret@2021",
    isLoggedIn,
    HasAccess,
    get_role_permission, Privilege, Roles, Access,
    dataSet,
    returnBool,
    has_profanity,
    random_number,
    extractVideoID,
    firebase_admin,
    firebase_auth,
    Db_Collection
}