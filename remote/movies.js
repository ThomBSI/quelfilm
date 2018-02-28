const https = require('https');
const httpUtils = require('./utils');

const apiKey = 'bc1b9e5030979ddbb65d3eca646e29f9';
const apiUrl = 'https://api.themoviedb.org/3';

/** 
 * Retourne les meilleurs films tels que retournés par l'API sous la forme d'un objet.
 */
exports.getPopularMovies = function () {
    return new Promise((resolve, reject) => {
        const url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;
        httpUtils.sendHttps(url).then(res => resolve(res)).catch(err => reject(err));
    });
}

/**
 * Retourne le nom de l'un des membres du personnel du film à partir de l'id du film, du département et du nom du poste.
 */
exports.getPersonName = function (movieId, departmentName, jobName) {
    return new Promise((resolve, reject) => {
        let url = `${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`;
        httpUtils.sendHttps(url)
            .then((res) => {
                if (typeof res != 'undefined') {
                    res[departmentName].forEach(elt => {
                        if (elt.job === jobName) resolve(elt.name);
                    });
                    resolve('');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}