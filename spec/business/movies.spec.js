const businessMovies = require('../../business/movies');
const remoteMovies = require('../../remote/movies');
const sinon = require('sinon');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ais trouvé aucun film correspondant à votre recherche...';

describe('businessMovies :', () => {
    describe('#getBestMovies', () => {
        let stubApiGetPopularMovies;
        let stubApiGetPersonName;
        describe('cas normaux :', () => {
            const apiJsonResponsePopularMovies = {
                results: [
                    {
                        id: '198663',
                        title: 'Le labyrinthe'
                    },
                    {
                        id: '441614',
                        title: 'Amar'
                    },
                    {
                        id: '337167',
                        title: 'Cinquante nuances plus claires'
                    },
                    {
                        id: '284053',
                        title: 'Thor  Ragnarok'
                    },
                    {
                        id: '374720',
                        title: 'Dunkerque'
                    }
                ]
            };
            beforeEach(() => {
                stubApiGetPopularMovies = sinon.stub(remoteMovies, 'getPopularMovies').resolves(apiJsonResponsePopularMovies);
                stubApiGetPersonName = sinon.stub(remoteMovies, 'getPersonName');
                stubApiGetPersonName
                    .withArgs('198663', 'crew', 'Director').resolves('Wes Ball')
                    .withArgs('441614', 'crew', 'Director').resolves('Esteban Crespo')
                    .withArgs('337167', 'crew', 'Director').resolves('James Foley')
                    .withArgs('284053', 'crew', 'Director').resolves('Taika Waititi')
                    .withArgs('374720', 'crew', 'Director').resolves('Christopher Nolan');
            });
            afterEach(() => {
                if (stubApiGetPopularMovies.restore) stubApiGetPopularMovies.restore();
                if (stubApiGetPersonName.restore) stubApiGetPersonName.restore();
            });
            it('Doit être une fonction.', () => {
                expect(businessMovies.getBestMovies).toEqual(jasmine.any(Function));
            });
            it('Doit retourner un tableau.', (done) => {
                businessMovies.getBestMovies().then((moviesList) => {
                    expect(moviesList).toEqual(jasmine.any(Array));
                    done();
                });
            });
            it('Doit retourner un tableau de 5 éléments.', (done) => {
                businessMovies.getBestMovies().then(moviesList => {
                    expect(moviesList.length).toEqual(5);
                    done();
                });
            });
            it('Doit retourner les bons noms de films.', (done) => {
                const expectedMoviesTitleList = ['Le labyrinthe', 'Amar', 'Cinquante nuances plus claires', 'Thor  Ragnarok', 'Dunkerque'];
                businessMovies.getBestMovies().then((moviesList) => {
                    moviesList.forEach((movieTitle, index) => {
                        expect(movieTitle).toContain(expectedMoviesTitleList[index]);
                    });
                    done();
                });
            });
            it('Doit retourner les bons noms de réalisateurs.', (done) => {
                const expectedDeirectorNameList = ['Wes Ball', 'Esteban Crespo', 'James Foley', 'Taika Waititi', 'Christopher Nolan'];
                businessMovies.getBestMovies().then((moviesList) => {
                    moviesList.forEach((movieTitle, index) => {
                        expect(movieTitle).toContain(expectedDeirectorNameList[index]);
                    });
                    done();
                });
            });
        });
        describe('cas anormaux :', () => {
            beforeEach(() => {
                stubApiGetPopularMovies = sinon.stub(remoteMovies, 'getPopularMovies');
                stubApiGetPersonName = sinon.stub(remoteMovies, 'getPersonName');
            });
            afterEach(() => {
                if (stubApiGetPopularMovies.restore) stubApiGetPopularMovies.restore();
                if (stubApiGetPersonName.restore) stubApiGetPersonName.restore();
            });
            it('erreur de l`\'api', (done) => {
                stubApiGetPopularMovies.rejects('api error');
                businessMovies.getBestMovies().catch((error) => {
                    expect(error).toBe(apiPopularMoviesErrorMessage);
                    done();
                });
            });
            it('Aucun film n\'est retourné par l\'API', (done) => {
                stubApiGetPopularMovies.resolves({results: []});
                businessMovies.getBestMovies().catch((error) => {
                    expect(error).toBe(apiNoResultsErrorMessage);
                    done();
                });
            });
            it('Moins de 5 films sont retournés par l\'API', (done) => {
                const apiJsonResponsePopularMovies = {
                    results: [
                        {
                            id: '198663',
                            title: 'Le labyrinthe'
                        },
                        {
                            id: '441614',
                            title: 'Amar'
                        }
                    ]
                };
                stubApiGetPersonName
                    .withArgs('198663', 'crew', 'Director').resolves('Wes Ball')
                    .withArgs('441614', 'crew', 'Director').resolves('Esteban Crespo');
                stubApiGetPopularMovies.resolves(apiJsonResponsePopularMovies);
                businessMovies.getBestMovies().then((moviesList) => {
                    expect(moviesList.length).toBe(2);
                    done();
                });
            });
        });
    });
    describe('#recapMovie', () => {
        describe('cas normaux :', () => {
            it('Doit être une fonction', () => {
                expect(businessMovies.recapMovie).toBe(jasmine.any(Function));
            });
            it('Doit appeler la méthode getMovieRecap', () => {
                
            });
            it('Doit retourner le résumé du film', () => {
                
            });
        });
        describe('cas anormaux :', () => {

        });
    });
});