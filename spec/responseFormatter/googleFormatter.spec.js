const sinon = require('sinon');
const { AssistantApp } = require('actions-on-google');
const formatter = require('../../responseFormatter/googleFormatter');
const Movie = require('../../models/movie');

describe('googleFormatter', () => {
    describe('#buildMoviesListItems', () => {
        let movieList;
        let movieTitles = ['A', 'B', 'C'];
        let directorsList = ['1', '2', '3']
        beforeEach(() => {
            movieList = new Array();
            movieTitles.forEach((title, index) => {
                let movie = new Movie();
                movie.title = title;
                movie.id = index + 12;
                movie.directorName = directorsList[index];
                movieList.push(movie);
            })
        });
        it('Doit retourner le bon nombre d\'éléments', () => {
            expect(formatter.buildMoviesListItems(movieList).items.length).toBe(movieList.length);
        });
        it('Doit retourner null si la liste d\'entrée est vide', () => {
            let emptyMovieList = [];
            expect(formatter.buildMoviesListItems(emptyMovieList)).toBe(null);
        });
        it('Doit contenir les bons identifiants de film', () => {
            formatter.buildMoviesListItems(movieList).items.forEach((item, index) => {
                expect(item.optionInfo.key).toBe(movieList[index].id);
            });
        });
        it('Doit contenir les bons noms de film', () => {
            formatter.buildMoviesListItems(movieList).items.forEach((item, index) => {
                expect(item.description).toContain(directorsList[index]);
            });
        });
        it('Doit contenir les bons noms de réalisateur', () => {
            formatter.buildMoviesListItems(movieList).items.forEach((item, index) => {
                expect(item.title).toContain(movieTitles[index]);
            });
        });
        it('Doit retourner une liste vide s\'il manque les id des films', () => {
            movieList.forEach((movie) => {
                return movie.id = '';
            });
            expect(formatter.buildMoviesListItems(movieList).items.length).toBe(0);
        });
        it('Doit retourner une liste vide s\'il manque les titres des films', () => {
            movieList.forEach((movie) => {
                return movie.title = '';
            });
            expect(formatter.buildMoviesListItems(movieList).items.length).toBe(0);
        });
    });
});