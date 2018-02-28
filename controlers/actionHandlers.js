const { AssistantApp, DialogflowApp } = require('actions-on-google');
const businessModule = require('../business/movies');
const googleFormatter = require('../responseFormatter/googleFormatter');
const actionNames = {
    INPUT_MOVIES_POPULAR: 'input.movies.popular',
    INPUT_MOVIE_RECAP: 'input.movie.recap',
    INPUT_WELCOME: 'input.welcome',
    INPUT_UNKNOWN: 'input.unknown'
}
/** Liste des noms d'action paramétrés dans la partie fullfilment des intents dans Dialogflow. */
exports.actionNames = actionNames;
/** 
 * Appel le bon gestionnaire en fonction du nom de l'action passé en paramètre.
 */
 exports.actionHandlers = function (action) {
     let functionHandler;
     switch (action) {
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

function inputMoviesPopularHandler() {
    return new Promise((resolve, reject) => {
        businessModule.getBestMovies()
            .then(moviesList => {
                let formatedResponse = googleFormatter.buildMoviesListItems(moviesList);
                console.log('formatedResponse',formatedResponse);
                resolve(formatedResponse);
            })
            .catch(errorMessage => reject(googleFormatter.buildSimpleResponse(errorMessage.name)));
    });
}

function inputMovieRecapHandler() {
    return new Promise((resolve, reject) => {
        businessModule.recapMovie(request.body.result.parameters['Movie'])
            .then(recap => resolve(recap))
            .catch(err => reject(err));
    });
}

/** The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent). */
function inputWelcomeHandler() {
    return new Promise((resolve, reject) => {
        resolve('Hello, Welcome to my Dialogflow agent!');
    });
}

/** The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents). Use the Actions on Google lib to respond to Google requests; for other requests use JSON. */
function inputUnknownHandler() {
    return new Promise((resolve, reject) => {
        resolve('Je rencontre un problème :-/ Pouvez-vous rééssayer plus tard ?');
    });
}

/** Default handler for unknown or undefined actions. */
function defaultHandler() {
    return new Promise((resolve, reject) => {
        resolve('Je ne comprend pas votre demande');
    });
}