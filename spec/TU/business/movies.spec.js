const sinon = require('sinon');
const businessMovies = require('../../../app/business/movies');
const remoteMovies = require('../../../app/remote/movies');
const Movie = require('../../../app/models/movie');
const Genre = require('../../../app/models/genre');
const Person = require('../../../app/models/person');

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
        let apiMovieList25 = [new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie()];
        let apiMovieList10 = [new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie(), new Movie()];
        let apiMovieList5 = [new Movie(), new Movie(), new Movie(), new Movie(), new Movie()];
        let restoreAll = () => {
            if (remoteMovies.getGenres.restore) remoteMovies.getGenres.restore();
            if (remoteMovies.getPersonByName.restore) remoteMovies.getPersonByName.restore();
            if (remoteMovies.discoverMovies.restore) remoteMovies.discoverMovies.restore();
        };
        let end = (done) => {
            done();
        };

        beforeEach(() => {
            restoreAll();
        })
        // appel à l'API
        it('Doit appeller la méthode discoverMovies de la couche remote une seule fois', (done) => {
            let spyDiscover = sinon.spy(remoteMovies, 'discoverMovies');
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            let test = () => {
                expect(spyDiscover.calledOnce).toBe(true);
            };
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    test();
                    end(done);
                })
                .catch((err) => {
                    test();
                    end(done);
                });
        });

        // genres
        it('Doit appeller la méthode getGenres de la couche remote une seule fois', (done) => {
            let spyGenre = sinon.spy(remoteMovies, 'getGenres');
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList25);
            let test = () => {
                expect(spyGenre.calledOnce).toBe(true);
            };
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    test();
                    end(done);
                })
                .catch((err) => {
                    test();
                    end(done);
                });
        });
        it('Ne doit pas appeller la méthode getGenres de la couche remote si aucun nom de genre n\'est passé en paramètre', (done) => {
            let spyGenre = sinon.spy(remoteMovies, 'getGenres');
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList25);
            let test = () => {
                expect(spyGenre.notCalled).toBe(true);
            };
            businessMovies.getMoviesByCriteria([], paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    test();
                    end(done);
                })
                .catch((err) => {
                    test();
                    end(done);
                });
        });
        it('Doit quand même résoudre une liste de film si la liste de nom de genre en entrée est vide', (done) => {
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria([], paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit quand même résoudre une liste de film si la liste de nom de genre en entrée ne correspond à aucun genre géré par l\'API', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves([]);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit quand même résoudre une liste de film si la méthode getGenres rejette une erreur', (done) => {
            sinon.stub(remoteMovies, 'getGenres').rejects();
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });

        // personnes
        it('Ne doit pas appeller la méthode getPersonByName de la couche remote si aucun nom de personne n\'est passé en paramètre', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            let spyPerson = sinon.spy(remoteMovies, 'getPersonByName');
            let test = () => {
                expect(spyPerson.notCalled).toBe(true);
            };
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, [], number)
                .then((res) => {
                    test();
                    end(done);
                })
                .catch((err) => {
                    test();
                    end(done);
                });
        });
        it('Doit appeller la méthode getPersonByName autant de fois qu\'il y a de noms passés en paramètre', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            let spyPerson = sinon.spy();
            sinon.stub(remoteMovies, 'getPersonByName').callsFake((name) => {
                return new Promise((resolve) => {
                    spyPerson(name);
                    resolve(new Person('123', 'vdvd'));
                });
            });
            let test = () => {
                expect(spyPerson.withArgs(paramActorsNameList[0]).calledOnce).toBe(true);
                expect(spyPerson.withArgs(paramActorsNameList[1]).calledOnce).toBe(true);
            };
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    test();
                    end(done);
                })
                .catch((err) => {
                    test();
                    end(done);
                });
        });
        it('Doit quand même résoudre une liste de film si la liste de nom de personnes est vide', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, [], number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit quand même résoudre une liste de film si l\'API ne parvient pas à retouver les personnes à partir de leur nom', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(null)
                .withArgs(paramActorsNameList[1]).resolves(null);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit quand même retourner une liste de film si l\'API ne parvient pas à retouver l\'une des personnes à partir de son nom', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(null)
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit quan même résoudre une liste de films si l\'API rejete une erreur lors de la recherche d\'une personne de la liste', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).rejects()
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });

        // période ou année
        it('Doit resoudre une liste de film même si aucune année ou période n\'a été spécifiée', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, null, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        
        // Sorties possibles
        it('Doit résoudre une liste de @Movie en cas de succès', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList10);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, number)
                .then((res) => {
                    expect(res).toEqual(apiMovieList10);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit résoudre une liste de @Movie de moins de 20 éléments si un nombre > 20 a été spécifié', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList25);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList, 30)
                .then((res) => {
                    expect(res.length).toBe(20);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit résoudre une liste de @Movie de moins de 5 éléments si aucun nombre n\'a été spécifié', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves(apiMovieList25);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList)
                .then((res) => {
                    expect(res.length).toBe(5);
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });
        it('Doit résoudre une chaine de caractère si aucun film n\'a été trouvé', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').resolves([]);
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList)
                .then((res) => {
                    expect(res).toEqual(jasmine.any(String));
                    end(done);
                })
                .catch((err) => {
                    fail(err);
                    end(done);
                });
        });

        // Cas d'erreur
        it('Doit rejeter une chaine de caractère en cas d\'erreur de la connexion avec l\'API', (done) => {
            sinon.stub(remoteMovies, 'getGenres').resolves(paramGenreList);
            sinon.stub(remoteMovies, 'getPersonByName')
                .withArgs(paramActorsNameList[0]).resolves(paramPersonList[0])
                .withArgs(paramActorsNameList[1]).resolves(paramPersonList[1]);
            sinon.stub(remoteMovies, 'discoverMovies').rejects();
            businessMovies.getMoviesByCriteria(paramGenreNameList, paramYear, paramPeriod, paramActorsNameList)
                .then((res) => {
                    fail(res);
                    end(done);
                })
                .catch((err) => {
                    expect(err).toEqual(jasmine.any(String));
                    end(done);
                });
        });
    });
});