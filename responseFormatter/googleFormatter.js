const DialogflowApp = require('actions-on-google').DialogflowApp;

/**
 * Construit une liste de films sous la forme d'une liste de cartes google assistant. 
 * @param {*} moviesList 
 */
exports.buildMoviesListItems = function(moviesList) {
    let listResponse = null;
    if(moviesList.length != 0) {
        let app = new DialogflowApp();
        let listOptions = [];
        moviesList.forEach((movie) => {
            let item = buildSingleMovieOptionItem(movie);
            if (item != null) {
                listOptions.push(item);
            }
        });
        listResponse = app.buildList(`Les ${moviesList.length} films les plus populaires en ce moment`).addItems(listOptions);
    }
    return listResponse;
}

/**
 * Construit une réponse simple sous la forme d'un texte et d'un speech. Le texte est optionnel.
 * @param {*} speech 
 * @param {*} displayText 
 */
exports.buildSimpleResponse = function(speech, displayText) {
    return JSON.stringify({
        speech: speech | displayText,
        displayText: displayText | speech
    });
}

/**
 * Construit la carte d'un film pour une liste. 
 * Pour construire la carte d'un film, il faut à minima le titre du film et son id. 
 * ATTENTION ! l'Id ne peut pas être égale à zéro ! 
 * @param {*} movie 
 */
function buildSingleMovieOptionItem(movie) {
    let item = null;
    if(movie && movie.title != '' && movie.id != '') {
        let app = new DialogflowApp();
        item = app.buildOptionItem(`${movie.id}`)
            .setTitle(movie.title)
            .setImage(movie.posterPath, movie.title);
        console.log('movie.posterPath', movie.posterPath);
        if(movie.directorName != '') item.setDescription(`de ${movie.directorName}`);
    }
    return item;
}