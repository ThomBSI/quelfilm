const getBestMovies = require('../../business/business').getBestMovies;
const recapMovie = require('../../business/business').recapMovie;

describe('Retourner une liste des films les plus populaires', () => {
    let result;
    getBestMovies().then(data => result = data);
    it('Retourne une liste de 5 films', () => {
        expect(result.length).toEqual(5);
    });
});