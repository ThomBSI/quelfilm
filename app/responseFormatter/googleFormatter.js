const DialogflowApp = require('actions-on-google').DialogflowApp;
const { text, textDev } = require('../resources/fr-FR');
const { Movie } = require('../models/Movie');

class GoogleFormatter {

    constructor() {

    }

    /**
     * Construit une liste de films sous la forme d'une liste de cartes google assistant. 
     * La liste en entrée doit comprendre entre 2 et 20 films (@Movie). 
     * Lève une erreur si la liste d'entrée est plus grande que 20. 
     * Retourne une simple carte si la liste ne contien qu'un élément. 
     * Retourne un message simple si la liste est vide.
     * 
     * @param {Array<Movie>} moviesList 
     */
    buildMoviesListItems(moviesList) {
        let response = null;
        let emptyMessage = exports.buildSimpleResponse(text.apiNoResultsErrorMessage);
        let app = new DialogflowApp();
        if (moviesList.length > 20) {
            throw new Error(textDev.listTooLong);
        } else if (moviesList.length === 1) {
            response = buildrichResponseBasicCard(moviesList[0]);
        } else if (moviesList.length != 0) {
            let listOptions = [];
            moviesList.forEach((movie) => {
                let item = buildSingleMovieOptionItem(movie);
                if (item != null) {
                    listOptions.push(item);
                }
            });
            if (listOptions.length === 0) {
                response = emptyMessage;
            } else {
                response = app.buildList(`${text.resultCountIntroduction}${moviesList.length}`).addItems(listOptions);
            }
        } else {
            response = emptyMessage;
        }
        return response;
    }

    /**
     * Construit une réponse simple sous la forme d'un texte et d'un speech. Le texte est optionnel.
     * @param {String} speech 
     * @param {String} displayText 
     */
    buildSimpleResponse(speech, displayText) {
        return {
            speech: speech | displayText,
            displayText: displayText | speech
        };
    }

    /**
     * 
     * @param {String} eventName 
     * @param {{String: String}} eventParameters 
     */
    respondWithEvent(eventName, eventParameters) {
        if (!eventParameters) eventParameters = {};
        let app = new DialogflowApp();
        app.ask
        return {
            followupEvent: {
                name: eventName,
                data: eventParameters
            }
        };
    }

}
module.exports.GoogleFormatter = GoogleFormatter;


/**
 * Construit la carte d'un film pour une liste. 
 * Pour construire la carte d'un film, il faut à minima le titre du film et son id. 
 * ATTENTION ! l'Id ne peut pas être égale à zéro ! 
 * @param {Movie} movie 
 */
function buildSingleMovieOptionItem(movie) {
    let item = null;
    if(movie && movie.title != '' && movie.id != '') {
        let app = new DialogflowApp();
        item = app.buildOptionItem(`${movie.id}`)
            .setTitle(movie.title)
            .setImage(movie.posterPath, movie.title)
            .setDescription(buildMovieDescription(movie));
    }
    return item;
}

/**
 * 
 * @param {Movie} movie 
 */
function buildrichResponseBasicCard(movie) {
    let app = new DialogflowApp();
    let basicCard = null;
    if(movie && movie.title != '' && movie.id != '') {
        basicCard = app.buildRichResponse()
            .addBasicCard(app.buildBasicCard()
                .setTitle(movie.title)
                .setSubtitle(buildMovieDescription(movie))
                .setImage(movie.posterPath, movie.title));
    }
    return basicCard;
}

/**
 * 
 * @param {Movie} movie 
 */
function buildMovieDescription(movie) {
    let description = '';
    if (movie.releaseDate != null) description = `${movie.releaseDate.getFullYear()}`;
    if (movie.directorName != '') description = `${description} - de ${movie.directorName}`;
    return description;
}