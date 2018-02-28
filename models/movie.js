function Movie() {}

Movie.prototype.id = '';
Movie.prototype.title = '';
Movie.prototype.directorName = '';
Movie.prototype.mainActors = [];
Movie.prototype.releaseDate = null;
Movie.prototype.posterPath = '';
Movie.prototype.abstract = '';

module.exports = Movie;