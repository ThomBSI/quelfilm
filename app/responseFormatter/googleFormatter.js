const DialogflowApp = require('actions-on-google').DialogflowApp;

/**
 * Construit une liste de films sous la forme d'une liste de cartes google assistant. 
 * @param {*} moviesList 
 */
exports.buildMoviesListItems = function(moviesList) {
    let listResponse = null;
    let emptyMessage = {
        speech: 'Aucun film n\'a pus être tourvé',
        displayText: 'Aucun film n\'a pus être tourvé'
    };
    if(moviesList.length != 0) {
        let app = new DialogflowApp();
        let listOptions = [];
        moviesList.forEach((movie) => {
            let item = buildSingleMovieOptionItem(movie);
            if (item != null) {
                listOptions.push(item);
            }
        });
        if(listOptions.length === 0) {
            listResponse = emptyMessage;
        } else {
            listResponse = app.buildList(`Les ${moviesList.length} films les plus populaires en ce moment`).addItems(listOptions);
        }
    } else {
        listResponse = emptyMessage;
    }
    return listResponse;
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
    };
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
        let description = '';
        if (movie.releaseDate != null) description = `${movie.releaseDate.getFullYear()}`;
        if (movie.directorName != '') description = `${description} - de ${movie.directorName}`;
        if (description != '') item.setDescription(description);
    }
    return item;
}