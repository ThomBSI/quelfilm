'use strict';

const businessModule = require('../business/business');
const INPUT_MOVIES_POPULAR = 'input.movies.popular';
const INPUT_MOVIE_RECAP = 'input.movie.recap';
const INPUT_WELCOME = 'input.welcome';
const INPUT_UNKNOWN = 'input.unknown';
const DEFAULT = 'default'
/** 
 * Liste des gestionnaires pouvant être appelés par DialogFlow. 
 * Chaque fonction retourne une Promise qui résout les données ou le message à afficher.
 */
let actionHandlers = new Map();
actionHandlers
    .set(DEFAULT, defaultHandler)
    .set(INPUT_UNKNOWN, inputUnknownHandler)
    .set(INPUT_WELCOME, inputWelcomeHandler)
    .set(INPUT_MOVIES_POPULAR, inputMoviesPopularHandler)
    .set(INPUT_MOVIE_RECAP, inputMovieRecapHandler);

exports.actionHandlers;

function inputMoviesPopularHandler() {
    return new Promise((resolve, reject) => {
        businessModule.getBestMovies()
            .then(titles => resolve(titles))
            .catch(err => reject(err));
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