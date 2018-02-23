'use strict';

const remote = require('../remote/remote');

/*
 * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
 */
exports.getBestMovies = function () {
    return new Promise((resolve, reject) => {
        remote.getPopularMovies()
            .then(apiResponse => {
                let titlesArray = [];
                apiResponse.results.forEach((movie, index) => {
                    let directorName = '';
                    remote.getPersonName(movie.id, 'crew', 'Director')
                        .then(dirName => {
                            if (dirName != '') directorName = ` de ${dirName}`;
                            if (index < 5) {
                                titlesArray.push(`${movie.title}${directorName}`);
                            } else {
                                let responseData = {};
                                responseData.googleResponse.suggestions = titlesArray;
                                responseData.standardResponse.speech = 'Voici une liste de 5 films.';
                                responseData.standardResponse.data = titlesArray.toString;
                                resolve(responseData);
                            }
                        })
                        .catch(err => reject(err));
                });
            })
            .catch(err => reject(err));
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