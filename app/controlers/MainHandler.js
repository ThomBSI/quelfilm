const { DialogflowApp } = require('actions-on-google');
const { Send } = require('./Send');
const { MovieService } = require('../business/MovieService');
const { GoogleFormatter } = require('../responseFormatter/GoogleFormatter');

const actionNames = {
    INPUT_MOVIES_UNGUIDED: 'input.movies.unguided',
    INPUT_MOVIES_POPULAR: 'input.movies.popular',
    INPUT_MOVIE_RECAP: 'input.movie.recap',
    INPUT_WELCOME: 'input.welcome',
    INPUT_UNKNOWN: 'input.unknown',
    EXIT_WEATHER: 'exit.weather'
};
/** Liste des noms d'action paramétrés dans la partie fullfilment des intents dans Dialogflow. */
exports.actionNames = actionNames;

class MainHandler {

    /**
     * 
     * @param {Send} sender 
     */
    constructor(sender) {
        this.send = sender;
        this.movieService = new MovieService();
        this.googleFormatter = new GoogleFormatter();
    }

    /**
     * Function to handle v1 webhook requests from Dialogflow.
     */
    processV1Request() {
        let action = this.send.request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
        let parameters = this.send.request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
        let inputContexts = this.send.request.body.result.contexts; // https://dialogflow.com/docs/contexts
        let requestSource = (this.send.request.body.originalRequest) ? this.send.request.body.originalRequest.source : undefined;
        actionHandlers(action)(parameters);
    }

    /** 
     * Appel le bon gestionnaire en fonction du nom de l'action passé en paramètre.
     * @param {String} action Nom de l'action à appeller
     */
    actionHandlers(action) {
        let functionHandler;
        switch (action) {
            case actionNames.INPUT_MOVIES_UNGUIDED:
                functionHandler = this.inputMoviesUnguidedHandler;
                break;
            case actionNames.INPUT_MOVIES_POPULAR:
                functionHandler = this.inputMoviesPopularHandler;
                break;
            case actionNames.INPUT_MOVIE_RECAP:
                functionHandler = this.inputMovieRecapHandler;
                break;
            case actionNames.INPUT_WELCOME:
                functionHandler = this.inputWelcomeHandler;
                break;
            case actionNames.INPUT_UNKNOWN:
                functionHandler = this.inputUnknownHandler;
                break;
            case actionNames.EXIT_WEATHER:
                functionHandler = this.exitWeatherHandler;
                break;
            default:
                functionHandler = this.defaultHandler;
                break;
        }
        return functionHandler;
    }

    inputMoviesUnguidedHandler(parameters) {
        let period;
        let personsNames = [];
        if (!parameters.genres) parameters.genres = [];
        if (!parameters.year) parameters.year = null;
        if (!parameters.people) parameters.people = [];
        if (!parameters.number) parameters.number = null;
        this.movieService.getMoviesByCriteria(parameters.genres, parameters.year, parameters.period, parameters.people, parameters.number)
            .then((movieList) => {
                let formatedResponse = this.googleFormatter.buildMoviesListItems(movieList);
                if (formatedResponse.speech || !formatedResponse.items) {
                    this.send.sendSimpleResponse(formatedResponse);
                } else {
                    this.send.sendResponseWithList('Quelques idées...', formatedResponse);
                }
            })
            .catch((errorMessage) => {
                this.send.sendSimpleResponse(this.googleFormatter.buildSimpleResponse(errorMessage.name));
            });
    }

    inputMoviesPopularHandler(parameters) {
        this.movieService.getBestMovies(parameters.number)
            .then((moviesList) => {
                let formatedResponse = this.googleFormatter.buildMoviesListItems(moviesList);
                if (formatedResponse.speech || !formatedResponse.items) {
                    this.send.sendSimpleResponse(formatedResponse);
                } else {
                    this.send.sendResponseWithList('Quelques idées...', formatedResponse);
                }
            })
            .catch((errorMessage) => {
                this.send.sendSimpleResponse(this.googleFormatter.buildSimpleResponse(errorMessage.name));
            });
    }

    inputMovieRecapHandler(parameters) {
        this.movieService.recapMovie(request.body.result.parameters['Movie'])
            .then((recap) => {
                this.send.sendSimpleResponse(recap)
            })
            .catch((err) => {
                this.send.sendSimpleResponse(err)
            });
    }

    /** The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent). */
    inputWelcomeHandler(parameters) {
        this.send.sendSimpleResponse('Hello, Welcome to my Dialogflow agent!');
    }

    /** The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents). Use the Actions on Google lib to respond to Google requests; for other requests use JSON. */
    inputUnknownHandler(parameters) {
        this.send.sendSimpleResponse('Je rencontre un problème :-/ Pouvez-vous rééssayer plus tard ?');
    }

    /** Default handler for unknown or undefined actions. */
    defaultHandler(parameters) {
        this.send.sendSimpleResponse('Je ne comprend pas votre demande');
    }

    exitWeatherHandler(parameters) {
        // const https = require('https');
        // const clientAccessToken = '';
        // const devAccessToken = '';
        // const url = `https://api.dialogflow.com/v1/`;    
        // http.get()

        // send.sendResponseWithEvent('go_to_weather');
        //go_to_weather test_event
    }
}
module.exports.MainHandler = MainHandler;