const sinon = require('sinon');
const actionHandlers = require('../../../app/controlers/actionHandlers');
const business = require('../../../app/business/movies');
const googleFormatter = require('../../../app/responseFormatter/googleFormatter');

describe('actionHandlers', () => {
    let inputName = '';
    let stubBuildMoviesListItems, stubBuildSimpleResponse;
    describe('#input.movies.popular', () => {
        inputName = actionHandlers.actionNames.INPUT_MOVIES_POPULAR;
        let stubGetBestMovies;
        let params = {}
        beforeEach(() => {
            stubGetBestMovies = sinon.stub(business, 'getBestMovies');
        });
        it('Doit retourner la réponse attendue en cas de succès dans les couches inférieurs', (done) => {
            let expectedGResponseList = {list: 'test'};
            let movieList= [];
            stubBuildMoviesListItems = sinon.stub(googleFormatter, 'buildMoviesListItems');
            stubBuildMoviesListItems.withArgs(movieList).returns(expectedGResponseList);
            stubGetBestMovies.resolves(movieList);
            actionHandlers.actionHandlers(inputName)(params)
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
            actionHandlers.actionHandlers(inputName)(params)
                .then((res) => fail('L\'action est suposée échouer...'))
                .catch((error) => {
                    expect(error).toBe(expectedGresponseError);
                    done();
                });
        });
        afterEach(() => {
            stubGetBestMovies.restore();
        });
        afterAll(() => {
            stubBuildMoviesListItems.restore();
            stubBuildSimpleResponse.restore();
        });
    });
});