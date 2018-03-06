/** Google Assistant helper library. */
const DialogflowApp = require('actions-on-google').DialogflowApp;
const AssistantApp = require('actions-on-google');
const actionHandlers = require('./actionHandlers');
const businessModule = require('../business/movies');
const googleFormatter = require('../responseFormatter/googleFormatter');
const actionNames = {
    INPUT_MOVIES_UNGUIDED: 'input.movies.unguided',
    INPUT_MOVIES_POPULAR: 'input.movies.popular',
    INPUT_MOVIE_RECAP: 'input.movie.recap',
    INPUT_WELCOME: 'input.welcome',
    INPUT_UNKNOWN: 'input.unknown'
};
const app;
/** Liste des noms d'action paramétrés dans la partie fullfilment des intents dans Dialogflow. */
exports.actionNames = actionNames;

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
    app = new DialogflowApp({
        request: request,
        response: response
    });
    actionHandlers(action)(parameters);
}

/** 
 * Appel le bon gestionnaire en fonction du nom de l'action passé en paramètre.
 */
const actionHandlers = function (action) {
    let functionHandler;
    switch (action) {
        case actionNames.INPUT_MOVIES_UNGUIDED:
            functionHandler = inputMoviesUnguidedHandler;
            break;
        case actionNames.INPUT_MOVIES_POPULAR:
            functionHandler = inputMoviesPopularHandler;
            break;
        case actionNames.INPUT_MOVIE_RECAP:
            functionHandler = inputMovieRecapHandler;
            break;
        case actionNames.INPUT_WELCOME:
            functionHandler = inputWelcomeHandler;
            break;
        case actionNames.INPUT_UNKNOWN:
            functionHandler = inputUnknownHandler;
            break;
        default:
            functionHandler = defaultHandler;
            break;
    }
    return functionHandler;
}

function inputMoviesUnguidedHandler(parameters) {
    let period;
    if (!parameters.genres) parameters.genres = [];
    if (!parameters.year) parameters.year = null;
    if (!parameters.persons) parameters.persons = [];
    if (!parameters.number) parameters.number = null;
    businessModule.getMoviesByCriteria(
        parameters.genres,
        parameters.year,
        parameters.period,
        parameters.persons,
        parameters.number)
        .then((movieList) => {
            let formatedResponse = googleFormatter.buildMoviesListItems(movieList);
            resolve(formatedResponse);
        })
        .catch((errorMessage) => {
            reject(googleFormatter.buildSimpleResponse(errorMessage.name));
        });
}

function inputMoviesPopularHandler(parameters) {
    businessModule.getBestMovies(parameters.number)
        .then(moviesList => {
            let formatedResponse = googleFormatter.buildMoviesListItems(moviesList);
            
            app.askWithList('Quelques idées', formatedResponse);
        })
        .catch(errorMessage => {
            reject(googleFormatter.buildSimpleResponse(errorMessage.name));
        });
}

function inputMovieRecapHandler(parameters) {
    businessModule.recapMovie(request.body.result.parameters['Movie'])
        .then(recap => resolve(recap))
        .catch(err => reject(err));
}

/** The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent). */
function inputWelcomeHandler(parameters) {
    resolve('Hello, Welcome to my Dialogflow agent!');
}

/** The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents). Use the Actions on Google lib to respond to Google requests; for other requests use JSON. */
function inputUnknownHandler(parameters) {
    resolve('Je rencontre un problème :-/ Pouvez-vous rééssayer plus tard ?');
}

/** Default handler for unknown or undefined actions. */
function defaultHandler(parameters) {
    resolve('Je ne comprend pas votre demande');
}