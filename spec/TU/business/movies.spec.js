const sinon = require('sinon');
const businessMovies = require('../../../app/business/movies');
const remoteMovies = require('../../../app/remote/movies');
const Movie = require('../../../app/models/movie');
const Genre = require('../../../app/models/genre');
const Person = require('../../../app/models/person');

const apiPopularMoviesErrorMessage = 'Je n\'arrive à récupérer les films auprès du serveur...';
const apiNoResultsErrorMessage = 'Je n\'ai trouvé aucun film correspondant à votre recherche...';

describe('businessMovies :', () => {
    xdescribe('#getBestMovies', () => {
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
        let paramGenreNameList = ['action', 'drame'];
        let paramActorsNameList = ['John Doe', 'Jean Gabin'];
        let paramYear = 2017;
        let number = 10;
        let paramPeriod = [new Date('2017-01-01'), new Date('2017-03-01')];
        let paramGenreList = [new Genre(12, 'action'), new Genre(13, 'drame')];
        let paramPersonList = [new Person(231, 'John Doe'), new Person(589, 'Jean Gabin')];
        let apiMovieList = [new Movie(), new Movie()];

        // appel à l'API
        TODO:it('Doit appeller la méthode discoverMovies de la couche remote une seule fois', (done) => {
            let mock = sinon.mock(remoteMovies);
            let exp = mock.expects('discoverMovies').once().resolves(apiMovieList);
            mock.expects('getGenres').resolves(paramGenreList);
            mock.expects('getPersonByName').withArgs(paramActorsNameList[0]).resolves(paramPersonList[0]);
            mock.expects('getPersonByName').withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);

            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    exp.verify();
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });

                mock.restore();
        });

        // genres
        TODO:xit('Doit appeller la méthode getGenres de la couche remote autant de fois qu\'il y a de noms de genres passés en paramètre', (done) => {
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {

                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        TODO:xit('Ne doit pas appeller la méthode getGenres de la couche remote aucun nom de genre n\'est passé en paramètre', () => {
            
        });
        TODO:xit('Doit appeller la méthode getGenres de la couche remote une seule fois si et seulement si au moins un nom de genre est passé en paramètre', (done) => {
            let mock = sinon.mock(remoteMovies);
            let exp = mock.expects('discoverMovies')
                .exactly(1)
                .resolves(apiMovieList);
            mock.expects('getGenres').resolves(paramGenreList)
            mock.expects('getPersonByName').resolves(paramPersonList[0]);

            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
            .then((res) => {
                expGetGenre.verify();
                done();
            })
            .catch((err) => {
                fail(err);
                done();
            });

            mock.restore();
        });
        xit('Doit quand même retourner une liste de film si la liste de nom de genre est vide', () => {
            
        });
        TODO:xit('Doit résoudre une chaine de caractère si la liste de noms de genres en entrée est vide', (done) => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').never();
            expGetPersonByName = mockRemote.expects('getPersonByName').never();
            expDiecover = mockRemote.expects('discoverMovies').never();
                
            businessMovies.getMoviesByCriteria([], paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    mockRemote.verify();
                    expect(res).toEqual(jasmine.any(String));
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        TODO:xit('Doit résoudre une chaine de caractère si la liste de genres retourné par l\'API est vide', (done) => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves([]);
            expGetPersonByName = mockRemote.expects('getPersonByName').never();
            expDiecover = mockRemote.expects('discoverMovies').never();
                
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    mockRemote.verify();
                    expect(res).toEqual(jasmine.any(String));
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });

        // personnes
        xit('Doit appeller la méthode getPersonByName de la couche remote si et seulement si au moins un nom est passé en paramètre', (done) => {
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expGetPersonByName.verify();
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        xit('Doit appeller la méthode getPersonByName autant de fois qu\'il y a de noms passés en paramètre', (done) => {
            let twoPersonsList = [new Person(226, 'John Doe'), new Person(223, 'Micheal Bean')];

            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves(paramGenreList);
            expGetPersonByName = 
            mockRemote.expects('getPersonByName').once().withArgs('John Doe').resolves(twoPersonsList[0]);
            mockRemote.expects('getPersonByName').once().withArgs('Micheal Bean').resolves(twoPersonsList[1]);
            expDiecover = mockRemote.expects('discoverMovies').resolves(apiMovieList);

            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, ['John Doe', 'Micheal Bean'], number)
                .then((res) => {
                    expGetPersonByName.verify();
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        xit('Ne doit pas appeller la méthode getPersonByName de la couche remote aucun nom n\'est passé en paramètre', (done) => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves(paramGenreList);
            expGetPersonByName = mockRemote.expects('getPersonByName').never();
            expDiecover = mockRemote.expects('discoverMovies').resolves(apiMovieList);
            
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, [], number)
                .then((res) => {
                    expGetPersonByName.verify();
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        xit('Doit quand même retourner une liste de film si la liste de nom de personnes est vide', (done) => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves(paramGenreList);
            expDiecover = mockRemote.expects('discoverMovies').resolves(apiMovieList);
                
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, [], number)
                .then((res) => {
                    expect(res.length).toBe(2);
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });

        // période ou année
        TODO:xit('Doit passer une date au format YYY-MM-DD à l\'API', () => {
            
        });
        xit('Doit resoudre une liste de film même si aucune année ou période n\'a été spécifiée', () => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves(paramGenreList);
            expGetPersonByName = mockRemote.expects('getPersonByName').resolves(paramPersonList);
            expDiecover = mockRemote.expects('discoverMovies').resolves(apiMovieList);
            
            businessMovies.getMoviesByCriteria(paramGenreNameList, null, [], paramActorsNameList, number)
                .then((res) => {
                    expect(res.length).toBe(2);
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        
        // Sorties possibles
        xit('Doit résoudre une liste de @Movie en cas de succès', (done) => {
            mockRemote.restore();
            mockRemote = sinon.mock(remoteMovies);
            expGetGenre = mockRemote.expects('getGenres').resolves(paramGenreList);
            expGetPersonByName = mockRemote.expects('getPersonByName').resolves(paramPersonList);
            expDiecover = mockRemote.expects('discoverMovies').resolves(apiMovieList);
            
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, [], number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList);
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
        xit('Doit résoudre une liste de @Movie de moins de 20 éléments en cas de succès', (done) => {
            // TODO: Doit résoudre une liste de Movie de moins de 20 éléments en cas de succès

        });
        xit('Doit résoudre une chaine de caractère si aucun film n\'a été trouvé', (done) => {
            // TODO: Doit résoudre une liste de Movie vide si aucun film n\'a été trouvé

        });

        // Cas d'erreur
        xit('Doit rejeter une chaine de caractère en cas d\'erreur de la connexion avec l\'API', (done) => {
            // TODO: Doit rejeter une chaine de caractère en cas d\'erreur de la connexion avec l\'API

        });
    });
});