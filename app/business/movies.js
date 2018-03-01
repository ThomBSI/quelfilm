const remote = require('../remote/movies');
const Movie = require('../models/movie');
const tmdbRef = require('../config/tmdb');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ai trouvé aucun film correspondant à votre recherche...';

const urlPoster = 'https://image.tmdb.org/t/p/w500';

/*
 * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
 */
exports.getBestMovies = function (number) {
    if (!number) {
        number = 5;
    } else if (number < 2 ) {
        number = 2;
    } else if (number > 20) {
        number = 20;
    }
    return new Promise((resolve, reject) => {
        remote.getPopularMovies()
            .then(apiResponse => {
                if (typeof apiResponse != 'undefined') {
                    if(apiResponse.results.length === 0) resolve(new Array());
                    let moviesArray = [];
                    let promiseArray = [];
                    apiResponse.results.map((movie, index) => {
                        if (index < number) {
                            promiseArray.push(new Promise((resolveMap) => {
                                let movieObject = new Movie();
                                movieObject.title = movie[tmdbRef.moviePopular.title];
                                movieObject.id = movie[tmdbRef.moviePopular.id];
                                movieObject.posterPath = `${urlPoster}${movie[tmdbRef.moviePopular.posterPath]}`;
                                movieObject.releaseDate = movie[tmdbRef.moviePopular.releaseDate];
                                remote.getPersonName(movieObject.id, 'crew', 'Director')
                                    .then(dirName => {
                                        if (typeof dirName != 'undefined') {
                                            movieObject.directorName = dirName;
                                        }
                                        resolveMap(movieObject);
                                    })
                                    .catch((err) => {
                                        resolveMap(movieObject);
                                    });
                            }));
                        }
                    });
                    Promise.all(promiseArray)
                        .then((finalArray) => {
                            resolve(finalArray);
                        });
                }
            })
            .catch((err) => reject(apiPopularMoviesErrorMessage));
    });
}

/*
 * Retourne le résumé d'un filme à partir de son titre.
 */
exports.recapMovie = function (movieTitle) {
    return new Promise((resolve, reject) => {
        resolve('blablablabla');
        if (false) reject('dsfgsd');
    });
}