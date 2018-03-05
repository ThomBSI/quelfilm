const https = require('https');
const moment = require('moment');

const httpUtils = require('./utils');
const Movie = require('../models/movie');
const Genre = require('../models/genre');
const Person = require('../models/person');

const apiKey = 'bc1b9e5030979ddbb65d3eca646e29f9';
const apiUrl = 'https://api.themoviedb.org/3';
const apiDateFormat = 'YYYY-MM-DD';

/** 
 * Retourne les meilleurs films tels que retournés par l'API sous la forme d'un objet.
 */
exports.getPopularMovies = function () {
    return new Promise((resolve, reject) => {
        const url = buildUrl('/movie/popular');
        httpUtils.sendHttps(url)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            });
    });
}

/**
 * Retourne le nom de l'un des membres du personnel du film à partir de l'id du film, du département et du nom du poste.
 */
exports.getPersonName = function (movieId, departmentName, jobName) {
    return new Promise((resolve, reject) => {
        const url = buildUrl(`/movie/${movieId}/credits`);
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

/** 
 * Appel le point de terminaison /discover/movie de l'API. 
 * Permet de rechercher une liste de film selon certains critères. 
 * Résout une liste de films (objet Movie). 
 * (doc : https://developers.themoviedb.org/3/discover/movie-discover)
 * 
 * @param {*} genresList requis, tableau de Genre, non vide
 * @param {*} period optionel, année de sortie du film (int) OU période de temps (tableau de 2 Date : [date_debut, date_fin])
 * @param {*} personsList optionel, liste de Person
 * 
*/
exports.discoverMovies = function(genresList, period, personsList) {
    return new Promise((resolve, reject) => {
        const params = new Array();
        let genresIds = '';
        genresList.forEach((genre, index) => {
            if (index === 0) {
                genresIds = `${genre.id}`;
            } else {
                genresIds = `${genresIds},${genre.id}`;
            }
        });
        params.push({name: 'with_genres', value: `${genresIds}`});
        if (Array.isArray(period)) {
            let dateStart = moment(period[0]).format(apiDateFormat);
            let dateEnd = moment(period[1]).format(apiDateFormat);
            params.push({name: 'release_date.gte', value: dateStart});
            params.push({name: 'release_date.lte', value: dateEnd});
        } else {
            if (period != null) params.push({name: 'year', value: period});
        }
        if(personsList.length != 0) {
            let personIds = '';
            personsList.forEach((person, index) => {
                if (index === 0) {
                    personIds = `${person.personId}`;
                } else {
                    personIds = `${personIds},${person.personId}`;
                }
            });
            params.push({name: 'with_people', value: `${personIds}`})
        }
        const url = buildUrl('/discover/movie', params);
        httpUtils.sendHttps(url)
            .then((data) => {
                if (typeof data != 'undefined') {
                    let movieList = data.results.map((movieObj) => {
                        return buildMovieFromApiObject(movieObj);
                    });
                    resolve(movieList);
                }
            })
            .catch((err) => {
                reject();
            })
    });
}

/** 
 * Appel le point de terminsaison /genre/movie/list de l'API. 
 * Retourne un objet contenant la liste de tous les genres (objet Genre) de films gérés par l'API. 
 * (doc : https://developers.themoviedb.org/3/genres/get-movie-list)
*/
exports.getGenres = function() {
    return new Promise((resolve, reject) => {
        const url = buildUrl('/genre/movie/list');
        httpUtils.sendHttps(url)
            .then((data) => {
                if (typeof data != 'undefined') {
                    let genreList = data.genres.map((genreElt) => {
                        return new Genre(genreElt.id, genreElt.name);
                    });
                    resolve(genreList);
                }
            })
            .catch((err) => {
                reject();
            });
    });
}

/** 
 * Récupère auprès de l'API les informations relatives à une personne (objet Person) par rapport à son nom. 
 * Resout null si la personne demandée n'est pas trouvée par l'API. 
 * Point de terminaison : /search/person. 
 * (doc : https://developers.themoviedb.org/3/search/search-people)
*/
exports.getPersonByName = function(personName) {
    return new Promise((resolve, reject) => {
        const params = [
            {name: 'query', value: personName}
        ];
        const url = buildUrl('/search/person', params);
        httpUtils.sendHttps(url)
            .then((data) => {
                if (typeof data != 'undefined') {
                    if (data.results.length === 0) {
                        resolve(null);
                    } else {
                        let person = new Person(data.results[0].id);
                        person.name = data.results[0].name;
                        if (data.results[0].profile_path) person.profilePath = data.results[0].profile_path;
                        resolve(person);
                    }
                }
            })
            .catch((err) => {
                reject();
            })
    });
}

/**
 * Construit l'url à envoyer à l'API.
 * 
 * @param {*} endpoint ex : /discover/movie
 * @param {*} params ex : {
 *  name: 'sort_by',
 *  value: 'sort_by'
 * }
 */
function buildUrl(endpoint, params) {
    if (!params) params = [];
    let url = `${apiUrl}${endpoint}?api_key=${apiKey}&language=fr-FR&include_adult=false`;
    params.forEach((paramObj) => {
        url = `${url}&${paramObj.name}=${paramObj.value}`;
    });
    return url;
}

function buildMovieFromApiObject(apiMovieObject) {
    let movie = new Movie();
    movie.id = apiMovieObject.id;
    movie.posterPath = `https://image.tmdb.org/t/p/w500${apiMovieObject.poster_path}`;
    movie.title = apiMovieObject.title;
    movie.abstract = apiMovieObject.overview;
    movie.releaseDate = new Date(apiMovieObject.release_date);
    return movie;
}