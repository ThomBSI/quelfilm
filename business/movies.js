const remote = require('../remote/movies');
const Promise = require('promise');
const Movie = require('../models/movie');
const tmdbRef = require('../config/tmdb');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ai trouvé aucun film correspondant à votre recherche...';

const urlPoster = 'https://image.tmdb.org/t/p/w500';

/*
 * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
 */
exports.getBestMovies = function () {
    return new Promise((resolve, reject) => {
        remote.getPopularMovies()
            .then(apiResponse => {
                if (typeof apiResponse != 'undefined') {
                    // console.log('api response business', apiResponse);
                    if(apiResponse.results.length === 0) reject(apiNoResultsErrorMessage);
                    let moviesArray = [];
                    for (let index = 0; index < 5; index++) {
                        if (index === apiResponse.results.length) {
                            break;
                        } else {
                            let movie = apiResponse.results[index];
                            // console.log('business foreach', movie, index);
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
                                    moviesArray.push(movieObject);
                                    if (index === apiResponse.results.length - 1 || index === 4) {
                                        // console.log('bsuiness moviesArray', moviesArray);
                                        resolve(moviesArray);
                                    }
                                })
                                .catch((err) => {
                                    console.log('getBestMovies -> getPersonName', err)
                                });
                        }
                    }
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