const tmdbRef = require('../config/tmdb');
const { text } = require('../resources/fr-FR');
const { conf } = require('../config/conf');
const { global } = require('../config/tmdb');




const { MovieRemote } = require('../remote/MovieRemote');
const { Movie } = require('../models/Movie');
const { Person } = require('../models/Person');
const { Genre } = require('../models/Genre');

/**
 * @dependTo MovieRemote
 * @dependTo Movie
 * @dependTo Person
 * @dependTo Genre
 */
class MovieService {

    constructor() {
        this.movieRemote = new MovieRemote();
    }

    /*
    * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
    */
    getBestMovies(number) {
        number = verifyNumber(number);
        return new Promise((resolve, reject) => {
            this.movieRemote.getPopularMovies()
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
                                    movieObject.posterPath = `${global.urlPoster}${movie[tmdbRef.moviePopular.posterPath]}`;
                                    movieObject.releaseDate = movie[tmdbRef.moviePopular.releaseDate];
                                    this.movieRemote.getPersonName(movieObject.id, 'crew', 'Director')
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
                .catch((err) => reject(text.apiPopularMoviesErrorMessage));
        });
    }

    /*
    * Retourne le résumé d'un filme à partir de son titre.
    * 
    */
    recapMovie(movieTitle) {
        return new Promise((resolve, reject) => {
            resolve('blablablabla');
            if (false) reject('dsfgsd');
        });
    }

    /** 
     * Retourne une liste de films en fonction de critères passés par l'tuilisateur. 
     * Si l'API ne renvois aucun film, la méthode résout un message d'information en chaine de caractères. 
     * Rejette un message d'erreur en cas d'erreur de connection avec l'API. 
     * résout un message d'erreur si la liste de genre est vide. 
     * 
     * @param {*} genreNameList requis, liste des genres en tableau de chaine de caractères. Contient au moins 1 élément
     * @param {String} year optionel, année de sortie en chaine de caractères
     * @param {*} period optionel, période de temps sous la forme d'un tableau de chaine de caractères ([date_début, date_fin])
     * @param {*} personNameList optionel, liste de noms de personnes en chaine de caractères (acteurs ou personnel ayant participé au film)
     * @param {Number} number optionel, nombre de résultats souhaités
    */
    getMoviesByCriteria(genreNameList, year, period, personNameList, number) {
        number = verifyNumber(number);
        return new Promise((resolve, reject) => {
            searchGenres(genreNameList, {
                success: (genreList) => {
                    let searchedPeriod = year;
                    searchPersons(personNameList, (personList) => {
                        searchMovies(genreList, searchedPeriod, personList, number, {
                            success: (movieList) => {
                                resolve(movieList);
                            },
                            error: () => {
                                reject(text.apiErrorMessage);
                            }
                        });
                    });
                }
            });
        });
    }

}
module.exports.MovieService = MovieService;

/**
 * Vérifie que le nombre de résultats souhaité est bien compris entre 2 et 20 inclus. 
 * Retourne le nombre original si correcte, le nombre corrigé sinon. 
 * 
 * @param {Number} number requis, nombre de résultats souhaités
 */
function verifyNumber(number) {
    if (!number) {
        number = 5;
    } else if (number < 2 ) {
        number = 2;
    } else if (number > 20) {
        number = 20;
    }
    return number;
}

/**
 * Appel le callbacks.succes avec une liste vide si la liste d'entrée l'est aussi. 
 * @param {Array<String>} genreNameList 
 * @param {{success: Function}} callbacks
 */
function searchGenres(genreNameList, callbacks) {
    let searchedGenreList = [];
    if (genreNameList.length != 0) {
        this.movieRemote.getGenres()
            .then((allGenresList) => {
                for (let i = 0; i < genreNameList.length; i++) {
                    for (let j = 0; j < allGenresList.length; j++) {
                        if (genreNameList[i].match(new RegExp(`${allGenresList[j].name}`, 'gi'))) {
                            searchedGenreList.push(allGenresList[j]);
                            break;
                        }
                    }
                }
                callbacks.success(searchedGenreList);
            })
            .catch(() => {
                callbacks.success(searchedGenreList);
            });
    } else {
        callbacks.success(searchedGenreList);
    }
}

/**
 * Le callback retourne une liste de @Person, vide si aucun résultat ou erreurs au niveau de l'API. 
 * 
 * @param {Array<String>} personNameList 
 * @param {Function} callback 
 */
function searchPersons(personNameList, callback) {
    let searchedPersonList = new Array();
    if (personNameList.length != 0) {
        let promiseArray = [];
        personNameList.forEach((personName) => {
            promiseArray.push(new Promise((resolveMap) => {
                this.movieRemote.getPersonByName(personName)
                    .then((resolvedPerson) => {
                        if (typeof resolvedPerson != 'undefined') {
                            resolveMap(resolvedPerson);
                        }
                    })
                    .catch(() => {
                        resolveMap(null);
                    });
            }));
        });
        if (promiseArray.length != 0) {
            Promise.all(promiseArray)
                .then((resolvedSearchedPersonList) => {
                    resolvedSearchedPersonList.forEach((singlePerson) => {
                        if (singlePerson != null) {
                            searchedPersonList.push(singlePerson);
                        }
                    });
                    callback(searchedPersonList);
                })
                .catch(() => {});
        } else {
            callback(searchedPersonList);
        }
    } else {
        callback(searchedPersonList);
    }
}

/**
 * 
 * @param {Array<Genre>} searchedGenreList 
 * @param {Number} searchedPeriod 
 * @param {Array<Person>} searchedPersonList 
 * @param {Number} number
 * @param {{success: Function, error: Function}} callbacks
 */
function searchMovies(searchedGenreList, searchedPeriod, searchedPersonList, number, callbacks) {
    this.movieRemote.discoverMovies(searchedGenreList, searchedPeriod, searchedPersonList)
        .then((movieList) => {
            let finalMovieList = [];
            if (movieList.length === 0) {
                callbacks.success(text.apiNoResultsErrorMessage);
            } else {
                number = Math.min(number, movieList.length);
                for (let k = 0; k < number; k++) {
                    finalMovieList.push(movieList[k]);
                }
            }
            callbacks.success(finalMovieList);
        })
        .catch((err) => {
            callbacks.error();
        });
}