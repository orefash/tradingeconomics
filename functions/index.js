/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");

const functions = require('firebase-functions');

const express = require('express');
const app = express();

const appRoute = require('./src/app-route');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({
//     origin: "*", // (Whatever your frontend url is) 
//     credentials: true, // <= Accept credentials (cookies) sent by the client
// }))


app.use('/',appRoute);

exports.app = functions.https.onRequest(app);
