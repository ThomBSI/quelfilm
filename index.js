/** Cloud Functions for Firebase library. */
const functions = require('firebase-functions');
const v1Handler = require('./app/controlers/v1RequestHandler');
const send = require('./app/controlers/send');

/**
 * Main.
 */
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  if (request.body.result) {
    v1Handler.processV1Request(new send({request: request, response: response}));
  } else {
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});