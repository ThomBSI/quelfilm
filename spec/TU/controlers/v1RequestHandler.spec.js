const sinon = require('sinon');
const { DialogflowApp } = require('actions-on-google');
const handler = require('../../../app/controlers/v1RequestHandler');
const business = require('../../../app/business/movies');
const Movie = require('../../../app/models/movie');

describe('v1RequestHandler.js', () => {
    describe('#processV1Request', () => {
        describe('action = input.movies.popular', () => {
            let request;
            let response;
            let resolvedMovies;
            beforeAll(() => {
                request = {
                    body: {
                        result: {
                            action: 'input.movies.popular',
                            parameters: {},
                            contexts: {}
                        },
                        originalRequest : {
                            source: 'google'
                        }
                    }
                };
                response = {};
                let movie1 = new Movie();
                let movie2 = new Movie();
                movie1.id = '123';
                movie1.title = 'hbvsdhbvshd';
                movie2.id = '456';
                movie2.title = 'poifdutt';
                resolvedMovies = [movie1, movie2];
            });
            TODO: xit('Doit appeller la méthode getMoviesByCriteria de la couche business', () => {
                let mockBusiness = sinon.mock(business);
                let expGetMoviesByCriteria = mockBusiness.expects('getMoviesByCriteria')
                    .resolves(resolvedMovies);
                let mockActionOnGoogle = sinon.mock(DialogflowApp.prototype);
                let expAsk = mockActionOnGoogle.expects('ask')
                    .once()
                    .returns(null);
                handler.processV1Request(request, response);
                mockActionOnGoogle.verify();
                mockBusiness.restore();
            });
            TODO: xit('Doit appeller la méthode askWithList si une liste de 2 à 20 élément est résolue', () => {
                
            });
            TODO: xit('Doit appeller la méthode ask si une liste de 1 ou 0 éléments est résolue', () => {
                
            });
            TODO: xit('Doit appeller la méthode ask si la liste formaté est une @SimpleResponse', () => {
                
            });
            TODO: xit('Doit appeller la méthode ask si la liste formaté est une @BasicCard dans une @RichResponse', () => {
                
            });
            TODO: xit('Doit appeller la méthode ask en cas d\'erreur dans la couche business', () => {
                
            });
        });
        describe('action = input.movies.unguided', () => {
            TODO: xit('Doit appeller la méthode buildMoviesListItems de la couche de présentation', () => {
                
            });
            TODO: xit('Doit appeller la méthode getMoviesByCriteria de la couche business', () => {
                
            });
            TODO: xit('Doit passer en paramètre une liste de noms de genre à la méthode getMoviesByCriteria', () => {
                
            });
            TODO: xit('Doit passser en paramètre une liste d\'acteurs à la méthode getMoviesByCriteria', () => {
                
            });
            TODO: xit('Doit passser en paramètre un nom de réalisateur à la méthode getMoviesByCriteria', () => {
                
            });
            TODO: xit('Doit passser en paramètre une année de sortie ou un période à la méthode getMoviesByCriteria', () => {
                
            });
            TODO: xit('Doit retourner un message d\'erreur en chaine de caractère en cas d\'erreur de la couche business', () => {
                
            });
        });
        describe('action = input.movie.recap', () => {
            
        });
        describe('action = input.welcome', () => {
            
        });
        describe('action = input.unknown', () => {
            
        });
    });
});