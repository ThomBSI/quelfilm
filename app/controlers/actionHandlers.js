const { AssistantApp, DialogflowApp } = require('actions-on-google');
const businessModule = require('../business/movies');
const googleFormatter = require('../responseFormatter/googleFormatter');
let actionNames = {
    INPUT_MOVIES_UNGUIDED: 'input.movies.unguided',
    INPUT_MOVIES_POPULAR: 'input.movies.popular',
    INPUT_MOVIE_RECAP: 'input.movie.recap',
    INPUT_WELCOME: 'input.welcome',
    INPUT_UNKNOWN: 'input.unknown'
};
/** Liste des noms d'action paramétrés dans la partie fullfilment des intents dans Dialogflow. */
exports.actionNames = actionNames;
/** 
 * Appel le bon gestionnaire en fonction du nom de l'action passé en paramètre.
 */
exports.actionHandlers = function (action) {
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
    return new Promise((resolve, reject) => {
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
    });
}

function inputMoviesPopularHandler(parameters) {
    return new Promise((resolve, reject) => {
        businessModule.getBestMovies(parameters.number)
            .then(moviesList => {
                let formatedResponse = googleFormatter.buildMoviesListItems(moviesList);
                resolve(formatedResponse);
            })
            .catch(errorMessage => {
                reject(googleFormatter.buildSimpleResponse(errorMessage.name));
            });
    });
}

function inputMovieRecapHandler(parameters) {
    return new Promise((resolve, reject) => {
        businessModule.recapMovie(request.body.result.parameters['Movie'])
            .then(recap => resolve(recap))
            .catch(err => reject(err));
    });
}

/** The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent). */
function inputWelcomeHandler(parameters) {
    return new Promise((resolve, reject) => {
        resolve('Hello, Welcome to my Dialogflow agent!');
    });
}

/** The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents). Use the Actions on Google lib to respond to Google requests; for other requests use JSON. */
function inputUnknownHandler(parameters) {
    return new Promise((resolve, reject) => {
        resolve('Je rencontre un problème :-/ Pouvez-vous rééssayer plus tard ?');
    });
}

/** Default handler for unknown or undefined actions. */
function defaultHandler(parameters) {
    return new Promise((resolve, reject) => {
        resolve('Je ne comprend pas votre demande');
    });
}