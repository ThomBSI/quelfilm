const sinon = require('sinon');
const businessMovies = require('../../../app/business/movies');
const remoteMovies = require('../../../app/remote/movies');
const Movie = require('../../../app/models/movie');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ai trouvé aucun film correspondant à votre recherche...';

describe('businessMovies :', () => {
    describe('#getBestMovies', () => {
        let stubApiGetPopularMovies;
        let stubApiGetPersonName;
        const expectedMoviesTitleList = ['Le labyrinthe', 'Amar', 'Cinquante nuances plus claires', 'Thor  Ragnarok', 'Dunkerque', 'Ma vie', 'La suite', 'Dijon', 'Jésu 2, le Retouuur'];
        const expectedDeirectorNameList = ['Wes Ball', 'Esteban Crespo', 'James Foley', 'Taika Waititi', 'Christopher Nolan', 'Moi', 'Beber', 'JeanJean', 'Ce mec'];
        let expectedMoviesArray = new Array();
        beforeAll(() => {
            expectedMoviesTitleList.forEach((elt, index) => {
                let newMovie = new Movie();
                newMovie.title = elt;
                newMovie.directorName = expectedDeirectorNameList[index];
                expectedMoviesArray.push(newMovie);
            });
        });
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
                    },
                    {
                        id: '123456',
                        title: 'Ma vie'
                    },
                    {
                        id: '321654',
                        title: 'La suite'
                    },
                    {
                        id: '963258',
                        title: 'Dijon'
                    },
                    {
                        id: '147852',
                        title: 'Jésu 2, le Retouuur'
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
                    .withArgs('374720', 'crew', 'Director').resolves('Christopher Nolan')
                    .withArgs('123456', 'crew', 'Director').resolves('Moi')
                    .withArgs('321654', 'crew', 'Director').resolves('Beber')
                    .withArgs('963258', 'crew', 'Director').resolves('JeanJean')
                    .withArgs('147852', 'crew', 'Director').resolves('Ce mec');
            });
            it('Doit être une fonction', () => {
                expect(businessMovies.getBestMovies).toEqual(jasmine.any(Function));
            });
            it('Doit retourner un tableau', (done) => {
                businessMovies.getBestMovies()
                    .then((moviesList) => {
                        expect(moviesList).toEqual(jasmine.any(Array));
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
            it('Doit retourner un tableau de 5 éléments si aucun nombre n\'est spécifié', (done) => {
                businessMovies.getBestMovies()
                    .then(moviesList => {
                        expect(moviesList.length).toEqual(5);
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
            it('Doit retourner le bon nombre de films si spécifié', (done) => {
                businessMovies.getBestMovies(3)
                    .then(moviesList => {
                        expect(moviesList.length).toEqual(3);
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
            it('Doit retourner les bons titres de films', (done) => {
                businessMovies.getBestMovies()
                    .then((moviesList) => {
                        moviesList.forEach((returnedMovie, index) => {
                            expect(returnedMovie.title).toContain(expectedMoviesArray[index].title);
                        });
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
            it('Doit retourner les bons noms de réalisateurs', (done) => {
                businessMovies.getBestMovies()
                    .then((moviesList) => {
                        moviesList.forEach((returnedMovie, index) => {
                            expect(returnedMovie.directorName).toContain(expectedMoviesArray[index].directorName);
                        });
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
            it('Doit retourner le bon nombre de films malgré la latence de la méthode getPopularMovies', (done) => {
                stubApiGetPopularMovies.restore();
                let stubTime = sinon.stub(remoteMovies, 'getPopularMovies').callsFake(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(apiJsonResponsePopularMovies);
                        }, 500);
                    });
                });
                businessMovies.getBestMovies(8)
                    .then((moviesList) => {
                        if (typeof moviesList != 'undefined') {
                            expect(moviesList.length).toBe(8);
                        }
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
                stubTime.restore();
            });
            it('Doit retourner le bon nombre de films malgré la latence de la méthode getPersonName', (done) => {
                stubApiGetPersonName.restore();
                let stubTimePerson = sinon.stub(remoteMovies, 'getPersonName').callsFake((id, d, j) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            console.log(id, d, j);
                            Promise.resolve('Director name');
                        }, 500);
                    });
                });
                businessMovies.getBestMovies(4)
                    .then((moviesList) => {
                        if (typeof moviesList != 'undefined') {
                            expect(moviesList.length).toBe(4);
                        }
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
                stubTimePerson.restore();
            }, 4000);
            afterEach(() => {
                if (stubApiGetPopularMovies.restore) stubApiGetPopularMovies.restore();
                if (stubApiGetPersonName.restore) stubApiGetPersonName.restore();
            });
        });
        describe('cas anormaux :', () => {
            beforeEach(() => {
                stubApiGetPopularMovies = sinon.stub(remoteMovies, 'getPopularMovies');
                stubApiGetPersonName = sinon.stub(remoteMovies, 'getPersonName');
            });
            it('Doit rejetter la promesse si erreur de l\'API', (done) => {
                stubApiGetPopularMovies.restore();
                stubApiGetPopularMovies = sinon.stub(remoteMovies, 'getPopularMovies');
                stubApiGetPopularMovies.rejects('api error');
                businessMovies.getBestMovies()
                    .catch((error) => {
                        expect(error).toBe(apiPopularMoviesErrorMessage);
                        done();
                    })
                    .then((data) => {
                        if (typeof data != 'undefined') {
                            fail(data);
                        }
                        done();
                    });
            });
            it('Doit retourner un tableau vide si aucun film n\'est retourné par l\'API', (done) => {
                stubApiGetPopularMovies.resolves({results: []});
                businessMovies.getBestMovies()
                    .then((data) => {
                        if (typeof data != 'undefined') {
                            expect(data.length).toBe(0);
                        }
                        done();
                    })
                    .catch((error) => {
                        fail(data);
                    });
            });
            it('Doit retourner un tableau plus petit si moins de 5 films sont retournés par l\'API', (done) => {
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
                businessMovies.getBestMovies()
                    .then((moviesList) => {
                        expect(moviesList.length).toBe(2);
                        done();
                    }).catch((err) => {
                        fail(err);
                        done();
                    });
            });
            afterEach(() => {
                if (stubApiGetPopularMovies.restore) stubApiGetPopularMovies.restore();
                if (stubApiGetPersonName.restore) stubApiGetPersonName.restore();
            });
        });
        afterAll(() => {
            stubApiGetPopularMovies.restore();
            stubApiGetPersonName.restore();
        });
    });
    describe('#getMoviesByCriteria', () => {
        let spy;
        let stubDiscoverMovies;
        let stubGetGenres;
        let stubGetPersonByName;
        let paramGenreList = ['action', 'drame'];
        let paramActorsList = ['John Doe'];
        beforeAll(() => {
            spy = sinon.spy();
        });
        afterAll(() => {
            if (spy.restore) spy.restore();
        });
        beforeEach(() => {
            spy.resetHistory();
            stubDiscoverMovies.restore();
            stubGetGenres.restore();
            stubGetPersonByName.restore();
            stubDiscoverMovies = sinon.stub(remoteMovies, 'discoverMovies').resolves();
            stubGetGenres = sinon.stub(remoteMovies, 'getGenres').resolves();
            stubGetPersonByName = sinon.stub(remoteMovies, 'getPersonByName').resolves();
        });
        it('Doit appeller la méthode discoverMovies de la couche remote', (done) => {
            stubDiscoverMovies.restore();
            let mockRemote = sinon.mock(remoteMovies);
            let expDiecover = mockRemote.expects('discoverMovies')
            stubDiscoverMovies = sinon.stub(remoteMovies, 'discoverMovies').callsFake(() => {
                return new Promise((resolve, reject) => {
                    spy();
                    resolve();
                });
            });
            businessMovies.getMoviesByCriteria(paramGenreList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(spy.called).toBe(true);
                    }
                    done();
                })
                .catch((err) => fail(err));
        });
        it('Doit appeller la méthode getGenres de la couche remote une seule fois', () => {
            stubGetGenres.restore();
            stubGetGenres = sinon.stub(remoteMovies, 'getGenres').callsFake(() => {
                return new Promise((resolve, reject) => {
                    spy();
                    resolve();
                });
            });
            businessMovies.getMoviesByCriteria(paramGenreList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(spy.calledOnce).toBe(true);
                    }
                    done();
                })
                .catch((err) => fail(err));
        });
        it('Doit appeller la méthode getPersonByName de la couche remote si et seulement si au moins un nom est passé en paramètre', () => {
            stubGetPersonByName.restore();
            stubGetPersonByName = sinon.stub(remoteMovies, 'getPersonByName').callsFake(() => {
                return new Promise((resolve, reject) => {
                    spy();
                    resolve();
                });
            });
            businessMovies.getMoviesByCriteria(paramGenreList, paramActorsList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(spy.callCount).toBe(paramActorsList.length);
                    }
                    done();
                })
                .catch((err) => fail(err));
            spy.resetHistory();
            businessMovies.getMoviesByCriteria(paramGenreList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(spy.callCount).toBe(0);
                    }
                    done();
                })
                .catch((err) => fail(err));
        });
        it('Doit résoudre une liste de Movie en cas de succès', () => {
            businessMovies.getMoviesByCriteria(paramGenreList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(res[0]).toEqual(jasmine.any(Movie));
                    }
                    done();
                })
                .catch((err) => fail(err));
        });
        it('Doit résoudre une liste de Movie non vide en cas de succès', () => {
            businessMovies.getMoviesByCriteria(paramGenreList)
                .then((res) => {
                    if (typeof res != 'undefined') {
                        expect(res.length).not.toBe(0);
                    }
                    done();
                })
                .catch((err) => fail(err));
        });
        it('Doit résoudre une liste de Movie de moins de 20 éléments en cas de succès', () => {
            // TODO: Doit résoudre une liste de Movie de moins de 20 éléments en cas de succès

        });
        it('Doit résoudre une chaine de caractère si aucun film n\'a été trouvé', () => {
            // TODO: Doit résoudre une liste de Movie vide si aucun film n\'a été trouvé

        });
        it('Doit rejeter une chaine de caractère en cas d\'erreur de la connexion avec l\'API', () => {
            // TODO: Doit rejeter une chaine de caractère en cas d\'erreur de la connexion avec l\'API

        });
    });
});