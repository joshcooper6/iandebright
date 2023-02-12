const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

require('dotenv').config();
const express = require('express');
const app = express();
const port = 4444;
const { getS3Images } = require('./aws');

app.use(express.json());
app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));

app.get('/images', (req, res) => {
  getS3Images().then(response => res.send(response));
});

app.listen(port, () => {
    console.log(`server deployed on port ${port}`)
});


exports.app = exports.app = functions.https.onRequest(app);