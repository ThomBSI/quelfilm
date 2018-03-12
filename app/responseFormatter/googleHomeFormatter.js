const Movie = require('../models/movie');

class GoogleHome {

    constructor() {
    }

    /**
     * 
     * @param {Array<Movie>} movieList 
     */
    buildMovieListWithText(movieList) {
        let speechStr = '';
        movieList.forEach((movie) => {
            speechStr = `${speechStr} ${movie.title} de ${movie.releaseDate.getFullYear()}`;
        })
    }
}
exports.GoogleHome = GoogleHome;