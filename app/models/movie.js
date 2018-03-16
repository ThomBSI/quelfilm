const { Person } = require('./Person');

class Movie {
    
    constructor() {
        /**
         * @type String
         */
        this.id = '';
        this.title = '';
        this.directorName = '';
        /**
         * @type Array<Person>
         */
        this.mainActors = [];
        /**
         * @type Date
         */
        this.releaseDate = null;
        this.posterPath = '';
        this.abstract = '';
    }
}
module.exports.Movie = Movie;