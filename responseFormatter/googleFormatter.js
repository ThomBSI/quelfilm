const { AssistantApp, DialogflowApp } = require('actions-on-google');

/**
 * Construit une liste de films sous la forme d'une liste de cartes google assistant. 
 * Le nombre déléments doit être compris entre 2 et 20 inclus.
 * @param {*} moviesList 
 */
exports.buildMoviesListItems = function(moviesList) {
    if(moviesList.length === 0) return null;
    let app = new AssistantApp();
    let richResponse = app.buildRichResponse();
    moviesList.forEach((movie) => {
        richResponse.addBasicCard(buildSingleMovieCard(movie));
    });
    return richResponse;
}

/**
 * Construit la carte d'un film.
 * @param {*} movie 
 */
exports.buildSingleMovieCard = function(movie) {
    if(movie === null || movie.title) return null;
    let app = new AssistantApp();
    let card = app.buildBasicCard();
    card.setTitle(movie.title);




    moviesList.forEach((movie) => {
        richResponse.addBasicCard(buildSingleMovieCard(movie));
    });
    return richResponse;
}