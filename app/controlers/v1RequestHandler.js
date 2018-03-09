const Send = require('./send');
const businessModule = require('../business/movies');
const googleFormatter = require('../responseFormatter/googleFormatter');
const actionNames = {
    INPUT_MOVIES_UNGUIDED: 'input.movies.unguided',
    INPUT_MOVIES_POPULAR: 'input.movies.popular',
    INPUT_MOVIE_RECAP: 'input.movie.recap',
    INPUT_WELCOME: 'input.welcome',
    INPUT_UNKNOWN: 'input.unknown'
};
let send;

/** Liste des noms d'action paramétrés dans la partie fullfilment des intents dans Dialogflow. */
exports.actionNames = actionNames;
/**
 * Function to handle v1 webhook requests from Dialogflow.
 * @param {*} request 
 * @param {*} response 
 */
exports.processV1Request = function (sender) {
    console.log('$1')
    let action = sender.request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = sender.request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = sender.request.body.result.contexts; // https://dialogflow.com/docs/contexts
    let requestSource = (sender.request.body.originalRequest) ? sender.request.body.originalRequest.source : undefined;
    send = sender;
    actionHandlers(action)(parameters);
}

/** 
 * Appel le bon gestionnaire en fonction du nom de l'action passé en paramètre.
 */
function actionHandlers(action) {
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
    console.log('parameters', parameters);
    let period;
    let personsNames = [];
    if (!parameters.genres) parameters.genres = [];
    if (!parameters.year) parameters.year = null;
    if (!parameters.people) parameters.people = [];
    if (!parameters.number) parameters.number = null;
    businessModule.getMoviesByCriteria(
        parameters.genres,
        parameters.year,
        parameters.period,
        parameters.people,
        parameters.number)
        .then((movieList) => {
            let formatedResponse = googleFormatter.buildMoviesListItems(movieList);
            if (formatedResponse.speech || !formatedResponse.items) {
                send.sendSimpleResponse(formatedResponse);
            } else {
                send.sendResponseWithList('Quelques idées...', formatedResponse);
            }
        })
        .catch((errorMessage) => {
            send.sendSimpleResponse(googleFormatter.buildSimpleResponse(errorMessage.name));
        });
}

function inputMoviesPopularHandler(parameters) {
    businessModule.getBestMovies(parameters.number)
        .then((moviesList) => {
            let formatedResponse = googleFormatter.buildMoviesListItems(moviesList);
            if (formatedResponse.speech || !formatedResponse.items) {
                send.sendSimpleResponse(formatedResponse);
            } else {
                send.sendResponseWithList('Quelques idées...', formatedResponse);
            }
        })
        .catch((errorMessage) => {
            send.sendSimpleResponse(googleFormatter.buildSimpleResponse(errorMessage.name));
        });
}

function inputMovieRecapHandler(parameters) {
    businessModule.recapMovie(request.body.result.parameters['Movie'])
        .then((recap) => {
            send.sendSimpleResponse(recap)
        })
        .catch((err) => {
            send.sendSimpleResponse(err)
        });
}

/** The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent). */
function inputWelcomeHandler(parameters) {
    send.sendSimpleResponse('Hello, Welcome to my Dialogflow agent!');
}

/** The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents). Use the Actions on Google lib to respond to Google requests; for other requests use JSON. */
function inputUnknownHandler(parameters) {
    send.sendSimpleResponse('Je rencontre un problème :-/ Pouvez-vous rééssayer plus tard ?');
}

/** Default handler for unknown or undefined actions. */
function defaultHandler(parameters) {
    send.sendSimpleResponse('Je ne comprend pas votre demande');
}