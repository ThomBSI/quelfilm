/** Google Assistant helper library. */
const DialogflowApp = require('actions-on-google').DialogflowApp;
const actionHandlers = require('./actionHandlers');

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
    actionHandlers.actionHandlers(action)(parameters)
        .then(response => {
            // let app2 = new DialogflowApp();
            // // app.askWithList('C\'est qui le papa ?', 
            // let listTest = app2.buildList('titre !')
            //     .addItems([app2.buildOptionItem('1').setTitle('bof').setImage('https://image.tmdb.org/t/p/w500/7h9LUexxkTSX9YWSQ88b6PE1JdL.jpg', 'affiche').setDescription('de Michel druker'),
            //     app2.buildOptionItem('2').setTitle('hehe').setImage('https://image.tmdb.org/t/p/w500/7h9LUexxkTSX9YWSQ88b6PE1JdL.jpg', 'poster')]);
            // console.log(response);
            console.log(response);
            if (typeof response === 'string' || response.speech) {
                app.ask(response);
            } else {
                app.askWithList('Quelques idées...', response);
            }
        })
        .catch(errorResponse => {
            app.ask(errorResponse);
        });
}