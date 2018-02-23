'use strict';

const conf = require('../conf');
const { AssistantApp, DialogflowApp } = require('actions-on-google');

/**
 * Envois la réponse correctement formaté à Dialogflow.
 * @param {*} responseToUser 
 * @param {*} requestSource 
 */
exports.sendResponse = function(responseToUser, app, requestSource) {
    if (requestSource === conf.googleAssistantRequest) {
        sendGoogleResponse(responseToUser, app);
    } else {
        sendStandardResponse(responseToUser, app);
    }
}

exports.sendError = function(error) {
    let appAsist = new AssistantApp();
    let response = appAsist.buildRichResponse().addSimpleResponse('Je suis désolé, je n\'arrive pas à traiter votre demande...');
}

/**
 * Function to send correctly formatted Google Assistant responses to Dialogflow which are then sent to the user.
 * @param {*} responseToUser 
 */
let sendGoogleResponse = function(responseToUser, app) {
    let response;
    let appAsist = new AssistantApp();
    if (typeof responseToUser === 'string') {
        response = appAsist.buildRichResponse().addSimpleResponse(responseToUser);
    } else if(responseToUser.googleResponse.suggestions) {
        response = appAsist.buildRichResponse().addSuggestions(responseToUser.googleResponse.suggestions);
    } else if (responseToUser.googleResponse.basicCard) {

    } else if (responseToUser.googleResponse.list) {
        
    } else {
        sendError();
    }
    app.ask(response);
}

/**
 * Function to send correctly formatted responses to Dialogflow which are then sent to the user.
 * @param {*} responseToUser 
 */
let sendStandardResponse = function (responseToUser, app) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
        let responseJson = {};
        responseJson.speech = responseToUser; // spoken response
        responseJson.displayText = responseToUser; // displayed response
        response.json(responseJson); // Send response to Dialogflow
    } else {
        // If the response to the user includes rich responses or contexts send them to Dialogflow
        let responseJson = {};
        // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
        responseJson.speech = responseToUser.standardResponse.speech || responseToUser.standardResponse.displayText;
        responseJson.displayText = responseToUser.standardResponse.displayText || responseToUser.standardResponse.speech;
        // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
        responseJson.data = responseToUser.standardResponse.data;
        // Optional: add contexts (https://dialogflow.com/docs/contexts)
        responseJson.contextOut = responseToUser.outputContexts;
        response.json(responseJson); // Send response to Dialogflow
    }
}