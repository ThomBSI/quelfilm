/** Google Assistant helper library. */
const DialogflowApp = require('actions-on-google').DialogflowApp;
const actionHandlers = require('./actionHandlers');
const v1Sender = require('../sender/v1Sender');

/**
 * Function to handle v1 webhook requests from Dialogflow.
 * @param {*} request 
 * @param {*} response 
 */
exports.processV1Request = function (request, response) {
    let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
    let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
    const app = new DialogflowApp({
        request: request,
        response: response
    });
    // If undefined or unknown action use the default handler
    if (!actionHandlers.actionHandlers[action]) {
        action = 'default';
    }
    actionHandlers.actionHandlers[action]()
        .then(data => v1Sender.sendResponse(data, app, requestSource))
        .catch(error => v1Sender.sendError(error));
}

function sendResponse(response) {

}