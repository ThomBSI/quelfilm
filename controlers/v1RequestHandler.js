/** Google Assistant helper library. */
const DialogflowApp = require('actions-on-google').DialogflowApp;
const actionHandlers = require('./actionHandlers');

/**
 * Function to handle v1 webhook requests from Dialogflow.
 * @param {*} request 
 * @param {*} response 
 */
exports.processV1Request = function (request, response) {
    console.log('processV1Request');
    let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
    let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
    const app = new DialogflowApp({
        request: request,
        response: response
    });
    actionHandlers.actionHandlers(action)()
        .then(response => {
            console.log('success', response);
            app.ask(response);
        })
        .catch(errorResponse => {
            console.log('error', errorResponse);
            app.ask(errorResponse);
        });
}