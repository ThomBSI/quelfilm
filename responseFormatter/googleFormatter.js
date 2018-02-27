const { AssistantApp, DialogflowApp, SimpleResponse } = require('actions-on-google');

/**
 * Construit une liste de films sous la forme d'une liste de cartes google assistant. 
 * @param {*} moviesList 
 */
exports.buildMoviesListItems = function(moviesList) {
    if(moviesList.length === 0) return null;
    let app = new AssistantApp();
    let richResponse = app.buildRichResponse();
    moviesList.forEach((movie) => {
        richResponse.addBasicCard(buildSingleMovieCard(movie));
    });
    console.log(richResponse);
    return richResponse;
}

/**
 * Construit la carte d'un film.
 * @param {*} movie 
 */
let buildSingleMovieCard = function(movie) {
    if(movie === null || movie.title) return null;
    let app = new AssistantApp();
    let card = app.buildBasicCard()
        .setTitle(movie.title)
        .setImage(movie.posterPath)
        .setSubtitle(`de ${movie.directorName}`);
    return card;
}

/**
 * Construit une réponse simple sous la forme d'un texte et d'un speech. Le texte est optionnel.
 * @param {*} speech 
 * @param {*} displayText 
 */
exports.buildSimpleResponse = function(speech, displayText) {
    return {
        speech: speech | displayText,
        displayText: displayText | speech
    }
}