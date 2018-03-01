const sinon = require('sinon');
const { AssistantApp } = require('actions-on-google');
const formatter = require('../../../app/responseFormatter/googleFormatter');
const Movie = require('../../../app/models/movie');

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
        it('Doit retourner un message si la liste d\'entrée est vide', () => {
            let emptyMovieList = [];
            expect(formatter.buildMoviesListItems(emptyMovieList).speech).toEqual(jasmine.any(String));
        });
        it('Doit contenir les bons identifiants de film', () => {
            formatter.buildMoviesListItems(movieList).items.forEach((item, index) => {
                expect(item.optionInfo.key).toBe(`${movieList[index].id}`);
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
        it('Doit retourner un message s\'il manque tout les id des films', () => {
            movieList.forEach((movie) => {
                return movie.id = '';
            });
            expect(formatter.buildMoviesListItems(movieList).speech).toEqual(jasmine.any(String));
        });
        it('Doit retourner une liste plus courte s\'il ne manque qu\'un id de film', () => {
            movieList.forEach((movie, index) => {
                if(index === 0) return movie.id = '';
            });
            expect(formatter.buildMoviesListItems(movieList).items.length).toBe(movieList.length - 1);
        });
        it('Doit retourner un message s\'il manque tout les titres des films', () => {
            movieList.forEach((movie) => {
                return movie.title = '';
            });
            expect(formatter.buildMoviesListItems(movieList).speech).toEqual(jasmine.any(String));
        });
        it('Doit retourner une liste plus courte s\'il ne manque qu\'un titre de film', () => {
            movieList.forEach((movie, index) => {
                if(index === 0) return movie.title = '';
            });
            expect(formatter.buildMoviesListItems(movieList).items.length).toBe(movieList.length - 1);
        });
        it('Doit retourner une simple carte si la liste de film est de exactement 1 élément', () => {// TODO: Ne doit pas retourner de liste si un liste est plus courte que 2 éléments
            
        });
        it('Doit retourner une liste toujours plus petite que 20 éléments', () => {// TODO: Ne doit jamais retourner une liste de plus de 20 éléments
            
        });
    });
});