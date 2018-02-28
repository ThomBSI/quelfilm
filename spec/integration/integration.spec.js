const actionHandler = require('../../controlers/actionHandlers');
const businessMovies = require('../../business/movies');
const remoteMovies = require('../../remote/movies');

describe('quelfilm', () => {
    describe('controlers/actionHandlers', () => {
        it('#inputMoviesPopularHandler', (done) => {
            actionHandler.actionHandlers(actionHandler.actionNames.INPUT_MOVIES_POPULAR)()
                .then((response) => {
                    if (typeof response != 'undefined') {
                        console.log('quelfilm controlers/actionHandlers #inputMoviesPopularHandler then', response);
                    }
                    done();
                })
                .catch((error) => {
                    console.log('quelfilm controlers/actionHandlers #inputMoviesPopularHandler catch', error);
                    done();
                });
        });
    });
    describe('business/movies', () => {
        it('#getBestMovies', (done) => {
            businessMovies.getBestMovies()
                .then((data) => {
                    if (typeof data != 'undefined') {
                        console.log('quelfilm business/movies #getBestMovies then', data);
                    }
                    done();
                })
                .catch((error) => {
                    console.log('quelfilm business/movies #getBestMovies catch', error);
                    done();
                });
        });
    });
    describe('remote/movies', () => {
        it('#getPopularMovies', (done) => {
            remoteMovies.getPopularMovies()
                .then((data) => {
                    if (typeof data != 'undefined') {
                        console.log('quelfilm remote/movies #getPopularMovies then', data);
                    }
                    done();
                })
                .catch((error) => {
                    console.log('quelfilm remote/movies #getPopularMovies catch', error);
                    done();
                });
        });
        it('#getPersonName', (done) => {
            remoteMovies.getPersonName(441614, 'crew', 'Director')
                .then((data) => {
                    if (typeof data != 'undefined') {
                        console.log('quelfilm remote/movies #getPersonName then', data);
                    }
                    done();
                })
                .catch((error) => {
                    console.log('quelfilm remote/movies #getPersonName catch', error);
                    done();
                });
        });
    });
});