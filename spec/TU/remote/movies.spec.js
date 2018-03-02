const sinon = require('sinon');
const remote = require('../../../app/remote/movies');
const httpUtils = require('../../../app/remote/utils');

describe('apiTheMovieDB', () => {
    let stubHttps
    describe('#getPopularMovies', () => {
        let expectedObject = {
            results: [
                {
                    id: 21554,
                    title: 'Coucou',
                    release_date: '2017-04-21',
                    poster_path: '/6uOMVZ6oG00xjq0KQiExRBw2s3P.jpg',
                    overview: 'bla bla bla bla'
                },
                {
                    id: 454,
                    title: 'Coucou2',
                    release_date: '2017-04-21',
                    poster_path: '/6uOMVZ6oG00xjq0KQiExRBw2s3P.jpg',
                    overview: 'bla bla bla bla'
                },
                {
                    id: 8784,
                    title: 'Coucou3',
                    release_date: '2017-04-21',
                    poster_path: '/6uOMVZ6oG00xjq0KQiExRBw2s3P.jpg',
                    overview: 'bla bla bla bla'
                }
            ]
        };
        beforeAll(() => {
            stubHttps = sinon.stub(httpUtils, 'sendHttps')
                .resolves(expectedObject);
        });
        it('Doit retourner un Objet', (done) => {
            remote.getPopularMovies().then((data) => {
                expect(typeof data).toBe('object');
                done();
            }).catch((err) => {fail(err); done();});
        });
        it('Doit retourné le JSON rencoyé par l\'API sous forme d\'Objet', (done) => {
            remote.getPopularMovies().then((data) => {
                expect(data).toBe(expectedObject);
                done();
            }).catch((err) => {fail(err); done();});
        });
        afterAll(() => {
            stubHttps.restore();
        });
    });
    describe('#getPersonName', () => {
        let apiResponse = {
            crew: [
                {
                    job: 'Director',
                    name: 'John Doe'
                }
            ]
        };
        beforeAll(() => {
            stubHttps = sinon.stub(httpUtils, 'sendHttps')
                .resolves(apiResponse);
        });
        it('Doit retourner le bon nom', (done) => {
            remote.getPersonName('1234', 'crew', 'Director').then((dirName) => {
                expect(dirName).toBe('John Doe');
                done();
            }).catch((err) => {fail(err); done();});
        });
        afterAll(() => {
            stubHttps.restore();
        });
    });
    describe('#discoverMovies', () => {
        it('Doit rejetter un message d\'erreur si la liste de Genre en paramètre est vide', () => {
            // TODO: Doit rejetter un message d\'erreur si la liste de Genre en paramètre est vide
        });
        it('Doit retourner une liste de Movie non vide si des films ont été trouvés', () => {
            // TODO: Doit retourner une liste de Movie non vide si des films ont été trouvés
        });
        it('Doit retourner une liste de Movie vide si aucun film n\'a été trouvé', () => {
            // TODO: Doit retourner une liste de Movie vide si aucun film n\'a été trouvé
        });
        it('Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API', () => {
            // TODO: Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API
        });
    });
    describe('#getGenres', () => {
        it('Doit retourner une liste de Genre en cas de succès', () => {
            // TODO: Doit retourner une liste de Genre en cas de succès
        });
        it('Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API', () => {
            // TODO: Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API
        });
    });
    describe('#getPersonByName', () => {
        it('Doit retourner un objet Person en cas de succès', () => {
            // TODO: Doit retourner un objet Person en cas de succès
        });
        it('Doit retourner null si la personne n\'est pas trouvée', () => {
            // TODO: Doit retourner null si la personne n\'est pas trouvée
        });
        it('Doit retourner le bon nom de personne en cas de succès', () => {
            // TODO: Doit retourner le bon nom de personne en cas de succès
        });
        it('Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API', () => {
            // TODO: Doit rejeter une chaine de caractère en cas d\'erreur de connexion avec l\'API
        });
    });
});