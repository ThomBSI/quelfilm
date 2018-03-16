/** Cloud Functions for Firebase library. */
const functions = require('firebase-functions');
const { MainHandler } = require('./app/controlers/MainHandler');
const { Send } = require('./app/controlers/Send');

/**
 * Main.
 */
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  if (request.body.result) {
    new MainHandler(new Send({request: request, response: response})).processV1Request();
  } else {
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});