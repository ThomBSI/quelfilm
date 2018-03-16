const { Movie } = require('../models/Movie');

class GoogleHomeFormatter {

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
exports.GoogleHomeFormatter = GoogleHomeFormatter;