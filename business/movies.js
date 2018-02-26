const remote = require('../remote/movies');
const Promise = require('promise');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ais trouvé aucun film correspondant à votre recherche...';

/*
 * Retourne la liste des titres des 5 meilleurs films sous la forme d'un tableau.
 */
exports.getBestMovies = function () {
    return new Promise((resolve, reject) => {
        remote.getPopularMovies()
            .then(apiResponse => {
                if(apiResponse.results.length === 0) reject(apiNoResultsErrorMessage);
                let titlesArray = [];
                apiResponse.results.forEach((movie, index) => {
                    let directorName = '';
                    remote.getPersonName(movie.id, 'crew', 'Director')
                        .then(dirName => {
                            if (dirName != '') directorName = ` de ${dirName}`;
                            titlesArray.push(`${movie.title}${directorName}`);
                            if (index === 4) resolve(titlesArray);
                        })
                        .catch(err => reject(apiPopularMoviesErrorMessage));
                });
                resolve(titlesArray);
            })
            .catch(err => reject(apiPopularMoviesErrorMessage));
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