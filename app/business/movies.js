const remote = require('../remote/movies');
const Movie = require('../models/movie');
const tmdbRef = require('../config/tmdb');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ai trouvé aucun film correspondant à votre recherche...';
const apiErrorMessage = 'Je rencontre une erreur... Tu peut réessayer plus tard ?';

const urlPoster = 'https://image.tmdb.org/t/p/w500';

/*
 * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
 */
exports.getBestMovies = function (number) {
    number = verifyNumber(number);
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

/** 
 * Retourne une liste de films en fonction de critères passés par l'tuilisateur. 
 * Si l'API ne renvois aucun film, la méthode résout un message d'information en chaine de caractères. 
 * Rejette un message d'erreur en cas d'erreur de connection avec l'API. 
 * résout un message d'erreur si la liste de genre est vide. 
 * 
 * @param {*} genreNameList requis, liste des genres en tableau de chaine de caractères. Contient au moins 1 élément
 * @param {*} year optionel, année de sortie en chaine de caractères
 * @param {*} period optionel, période de temps sous la forme d'un tableau de chaine de caractères ([date_début, date_fin])
 * @param {*} personList optionel, liste de noms de personnes en chaine de caractères (acteurs ou personnel ayant participé au film)
 * @param {*} number optionel, nombre de résultats souhaités
*/
exports.getMoviesByCriteria = function(genreNameList, year, period, personList, number) {
    number = verifyNumber(number);
    return new Promise((resolve, reject) => {
        if (genreNameList.length === 0) {
            resolve('J\'ai besoin de connaître le genre de films que tu aime');
        } else {
            remote.getGenres()
                .then((allGenresList) => {
                    if (allGenresList.length === 0) {
                        resolve('Je n\'arrive pas à comprendre les genres de films que tu souhaite');
                    } else {
                        // Récupération de la liste des genres recherchés
                        let searchedGenreList = [];
                        for (let i = 0; i < genreNameList.length; i++) {
                            for (let j = 0; j < allGenresList.length; j++) {
                                if (genreNameList[i].match(new RegExp(`${allGenresList[j].name}`, 'gi'))) {
                                    searchedGenreList.push(allGenresList[j]);
                                    break;
                                }
                            }
                        }
                        // TODO: Traitement de l'année ou de la période demandée
                        let searchedPeriod = year;
                        // récupération de la liste des personnes souhaitées
                        let promiseArray = [];
                        personList.forEach((personName) => {
                            promiseArray.push(new Promise((resolveMap) => {
                                remote.getPersonByName(personName)
                                    .then((resolvedPerson) => {
                                        if (typeof resolvedPerson != 'undefined' && resolvedPerson != null) {
                                            resolveMap(resolvedPerson);
                                        }
                                    })
                                    .catch(() => {
                                        console.log(`api error on ${personName}`);
                                    });
                            }));
                        });
                        if (promiseArray.length != 0) {
                            Promise.all(promiseArray)
                                .then((searchedPersonList) => {
                                    console.log('searchedPersonList', searchedPersonList);
                                    searchMovies(searchedGenreList, searchedPeriod, searchedPersonList, resolve, reject);
                                });
                        } else {
                            searchMovies(searchedGenreList, searchedPeriod, [], resolve, reject);
                        }
                    }
                })
                .catch(() => {
                    reject(apiErrorMessage);
                });
        }
    });
}

/**
 * Vérifie que le nombre de résultats souhaité est bien compris entre 2 et 20 inclus. 
 * Retourne le nombre original si correcte, le nombre corrigé sinon. 
 * 
 * @param {*} number requis, nombre de résultats souhaités
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

function searchMovies(searchedGenreList, searchedPeriod, searchedPersonList, resolve, reject) {
    console.log('COUCOU')
    remote.discoverMovies(searchedGenreList, searchedPeriod, searchedPersonList)
        .then((movieList) => {
            console.log(movieList)
            let finalMovieList = [];
            if (movieList.length === 0) {
                resolve('Aucun film n\'a été trouvé');
            } else {
                for (let k = 0; k < movieList.length; k++) {
                    finalMovieList.push(movieList[k]);
                }
            }
            resolve(finalMovieList);
        })
        .catch((err) => {
            reject(apiErrorMessage);
        });
}