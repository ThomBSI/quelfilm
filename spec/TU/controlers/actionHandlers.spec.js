const sinon = require('sinon');
const actionHandlers = require('../../../app/controlers/actionHandlers');
const business = require('../../../app/business/movies');
const googleFormatter = require('../../../app/responseFormatter/googleFormatter');
const Movie = require('../../../app/models/movie');

describe('actionHandlers', () => {
    let stubBuildMoviesListItems, stubBuildSimpleResponse;
    describe('#input.movies.popular', () => {
        let stubGetBestMovies;
        let params = {};
        beforeEach(() => {
            stubGetBestMovies = sinon.stub(business, 'getBestMovies');
        });
        it('Doit retourner la réponse attendue en cas de succès dans les couches inférieurs', (done) => {
            let expectedGResponseList = {list: 'test'};
            let movieList= [];
            stubBuildMoviesListItems = sinon.stub(googleFormatter, 'buildMoviesListItems');
            stubBuildMoviesListItems.withArgs(movieList).returns(expectedGResponseList);
            stubGetBestMovies.resolves(movieList);
            actionHandlers.actionHandlers('input.movies.popular')(params)
                .then((response) => {
                    expect(response).toBe(expectedGResponseList);
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        it('Doit retourner un message d\'erreur formaté en cas d\'erreur dans les couches inférieurs', (done) => {
            let expectedGresponseError = {speech: 'errormessage'};
            let errorMessage = 'errormessage';
            stubBuildSimpleResponse = sinon.stub(googleFormatter, 'buildSimpleResponse');
            stubBuildSimpleResponse.withArgs(errorMessage).returns(expectedGresponseError);
            stubGetBestMovies.rejects(errorMessage);
            actionHandlers.actionHandlers('input.movies.popular')(params)
                .then((res) => fail('L\'action est suposée échouer...'))
                .catch((error) => {
                    expect(error).toBe(expectedGresponseError);
                    done();
                });
        });
        afterEach(() => {
            if (stubGetBestMovies.restore) stubGetBestMovies.restore();
        });
        afterAll(() => {
            if (stubBuildMoviesListItems.restore) stubBuildMoviesListItems.restore();
            if (stubBuildSimpleResponse.restore) stubBuildSimpleResponse.restore();
        });
    });
    xdescribe('#input.movies.unguided', () => {
        inputName = actionHandlers.actionNames.INPUT_MOVIES_UNGUIDED;
        it('Doit appeller la méthode buildMoviesListItems de la couche de présentation', () => {
            // TODO: Doit appeller la méthode buildMoviesListItems de la couche de présentation
        });
        it('Doit appeller la méthode getMoviesByCriteria de la couche business', () => {
            // TODO: Doit appeller la méthode getMoviesByCriteria de la couche business
        });
        it('Doit passer en paramètre une liste de noms de genre à la méthode getMoviesByCriteria', () => {
            // TODO: Doit passer en paramètre une liste de noms de genre à la méthode getMoviesByCriteria
        });
        it('Doit passser en paramètre une liste d\'acteurs à la méthode getMoviesByCriteria', () => {
            // TODO: Doit passser en paramètre une liste d\'acteurs à la méthode getMoviesByCriteria
        });
        it('Doit passser en paramètre un nom de réalisateur à la méthode getMoviesByCriteria', () => {
            // TODO: Doit passser en paramètre un nom de réalisateur à la méthode getMoviesByCriteria
        });
        it('Doit passser en paramètre une année de sortie ou un période à la méthode getMoviesByCriteria', () => {
            // TODO: Doit passser en paramètre une année de sortie ou un période à la méthode getMoviesByCriteria
        });
        it('Doit retourner un message d\'erreur en chaine de caractère en cas d\'erreur de la couche business', () => {
            // TODO: Doit retourner un message d\'erreur en chaine de caractère en cas d\'erreur de la couche business
        });
    });
});