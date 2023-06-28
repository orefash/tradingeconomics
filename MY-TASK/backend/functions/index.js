
const {onRequest} = require("firebase-functions/v2/https");

const functions = require('firebase-functions');

const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({
//     origin: "*", // (Whatever your frontend url is) 
// }))


app.use(cors({origin: true}));


const appRoute = require('./src/app-route');





app.use('/',appRoute);

exports.app = functions.https.onRequest(app);
