const actionHandler = require('../../../app/controlers/actionHandlers');
const businessMovies = require('../../../app/business/movies');
const remoteMovies = require('../../../app/remote/movies');

xdescribe('quelfilm', () => {
    describe('controlers/actionHandlers', () => {
        it('#inputMoviesPopularHandler', (done) => {
            actionHandler.actionHandlers(actionHandler.actionNames.INPUT_MOVIES_POPULAR)()
                .then((response) => {
                    if (typeof response != 'undefined') {
                    }
                    done();
                })
                .catch((error) => {
                    done();
                });
        });
    });
    describe('business/movies', () => {
        it('#getBestMovies', (done) => {
            businessMovies.getBestMovies()
                .then((data) => {
                    if (typeof data != 'undefined') {
                    }
                    done();
                })
                .catch((error) => {
                    done();
                });
        });
    });
    describe('remote/movies', () => {
        it('#getPopularMovies', (done) => {
            remoteMovies.getPopularMovies()
                .then((data) => {
                    if (typeof data != 'undefined') {
                    }
                    done();
                })
                .catch((error) => {
                    done();
                });
        });
        it('#getPersonName', (done) => {
            remoteMovies.getPersonName(441614, 'crew', 'Director')
                .then((data) => {
                    if (typeof data != 'undefined') {
                    }
                    done();
                })
                .catch((error) => {
                    done();
                });
        });
    });
});