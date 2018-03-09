const sinon = require('sinon');
const { DialogflowApp } = require('actions-on-google');
const main = require('../../app/controlers/v1RequestHandler');
const Send = require('../../app/controlers/send');
const httpUtils = require('../../app/remote/utils');
const { text } = require('../../app/resources/fr-FR');

describe('Test d\'intégration', () => {
    let req = {
        body: {
            result: {
                source: '',
                resolvedQuery: '',
                action: '',
                parameters: {},
                contexts: [
                    {
                        name: '',
                        parameters: {},
                        lifeSpan: 5
                    }
                ]
            },
            status: {
                code: 200,
                errorType: 'success'
            }
        }
    };
    let response = {};
    let app = new DialogflowApp();
    describe('action = input.movies.unguided', () => {
        let spySimple = sinon.spy();
        let spyList = sinon.spy();
        let request = req;
        let sendMocked = {
            request: request,
            response: response,
            sendSimpleResponse: (response) => {
                spySimple([response]);
            },
            sendResponseWithList: (prompt, response) => {
                spyList([response]);
            }
        };
        request.body.result.action = 'input.movies.unguided';
        request.body.result.parameters.genres = ['Action'];
        describe('Je veux voir un film avec de l\'action', () => {
            let expectedList = app.buildList(`${text.resultCountIntroduction}5`).addItems([
                app.buildOptionItem().setTitle('Fatal Mission').setKey('138878').setDescription('1990').setImage('https://image.tmdb.org/t/p/w500/u351Rsqu5nd36ZpbWxIpd3CpbJW.jpg', 'Fatal Mission'),
                app.buildOptionItem().setTitle('Soldiers Of The Damned').setKey('345287').setDescription('2017').setImage('https://image.tmdb.org/t/p/w500/itdfycoMpjGWiGdjLUKMdAe9oQ5.jpg', 'Soldiers Of The Damned'),
                app.buildOptionItem().setTitle('Tomb Raider').setKey('338970').setDescription('2018').setImage('https://image.tmdb.org/t/p/w500/fpeX7q6878v3Oo6uoQvKzBzK7Ls.jpg', 'Tomb Raider'),
                app.buildOptionItem().setTitle('Suicide Squad 2').setKey('436969').setDescription('').setImage('https://image.tmdb.org/t/p/w500/365chZfMWzmEUGUgPrwZBnIlizY.jpg', 'Suicide Squad 2'),
                app.buildOptionItem().setTitle('賽德克．巴萊(下)彩虹橋').setKey('313230').setDescription('2011').setImage('https://image.tmdb.org/t/p/w500/yeL0afYB9exEYh0Lj4XIcJX4x9J.jpg', '賽德克．巴萊(下)彩虹橋')
            ]);
            let urlGetGenres = 'https://api.themoviedb.org/3/genre/movie/list?api_key=bc1b9e5030979ddbb65d3eca646e29f9&language=fr-FR&include_adult=false';
            let urlDiscoverMovies = 'https://api.themoviedb.org/3/discover/movie?api_key=bc1b9e5030979ddbb65d3eca646e29f9&language=fr-FR&include_adult=false&with_genres=28&sort_by=vote_average.desc';
            let dataGenres = {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Aventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comédie"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentaire"},{"id":18,"name":"Drame"},{"id":10751,"name":"Familial"},{"id":14,"name":"Fantastique"},{"id":36,"name":"Histoire"},{"id":27,"name":"Horreur"},{"id":10402,"name":"Musique"},{"id":9648,"name":"Mystère"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science-Fiction"},{"id":10770,"name":"Téléfilm"},{"id":53,"name":"Thriller"},{"id":10752,"name":"Guerre"},{"id":37,"name":"Western"}]};
            let dataDiscoverMovies = {"page":1,"total_results":21290,"total_pages":1065,"results":[{"vote_count":28,"id":138878,"video":false,"vote_average":10,"title":"Fatal Mission","popularity":3.032916,"poster_path":"\/u351Rsqu5nd36ZpbWxIpd3CpbJW.jpg","original_language":"en","original_title":"Fatal Mission","genre_ids":[10752,28,12],"backdrop_path":"\/wNq5uqVDT7a5G1b97ffYf4hxzYz.jpg","adult":false,"overview":"","release_date":"1990-07-25"},{"vote_count":10,"id":345287,"video":false,"vote_average":10,"title":"Soldiers Of The Damned","popularity":2.974154,"poster_path":"\/itdfycoMpjGWiGdjLUKMdAe9oQ5.jpg","original_language":"en","original_title":"Soldiers Of The Damned","genre_ids":[27,10752,28,53],"backdrop_path":"\/4KTHZhKB5JPKRv1QuBc6Tt2R1aG.jpg","adult":false,"overview":"","release_date":"2017-12-07"},{"vote_count":5,"id":338970,"video":false,"vote_average":10,"title":"Tomb Raider","popularity":26.965127,"poster_path":"\/fpeX7q6878v3Oo6uoQvKzBzK7Ls.jpg","original_language":"en","original_title":"Tomb Raider","genre_ids":[28,12,14],"backdrop_path":"\/xdPqNygbUXAdLfilrOSnrWoRwZd.jpg","adult":false,"overview":"Rebelle et indépendante, Lara Croft, 21 ans, n'a jamais cru que son père était mort. Elle décide un jour de se rendre sur l'île mystérieuse où il a été vu pour la dernière fois. Un périple où le danger guette à chaque instant…","release_date":"2018-03-14"},{"vote_count":4,"id":436969,"video":false,"vote_average":10,"title":"Suicide Squad 2","popularity":1.529436,"poster_path":"\/365chZfMWzmEUGUgPrwZBnIlizY.jpg","original_language":"en","original_title":"Suicide Squad 2","genre_ids":[28,12,14],"backdrop_path":null,"adult":false,"overview":"","release_date":""},{"vote_count":4,"id":313230,"video":false,"vote_average":10,"title":"賽德克．巴萊(下)彩虹橋","popularity":2.851479,"poster_path":"\/yeL0afYB9exEYh0Lj4XIcJX4x9J.jpg","original_language":"zh","original_title":"賽德克．巴萊(下)彩虹橋","genre_ids":[18,36,28],"backdrop_path":"\/w4Iq1gRmNFeRnI89VTpWVJKUART.jpg","adult":false,"overview":"","release_date":"2011-09-09"},{"vote_count":4,"id":414906,"video":false,"vote_average":10,"title":"The Batman","popularity":2.798083,"poster_path":"\/3t7QnmZSGk0c7K4b2mYKdCNj56y.jpg","original_language":"en","original_title":"The Batman","genre_ids":[28,12,18],"backdrop_path":"\/4Cp1zoZuXDXxIwzHbGnBJqrDvee.jpg","adult":false,"overview":"Batman fait sa première apparition en solo de l'Univers Cinématographique DC.","release_date":""},{"vote_count":2,"id":203121,"video":false,"vote_average":10,"title":"Les justiciers masqués","popularity":1.12826,"poster_path":"\/yuqyhyfFpMwxRSjf5OiZAxuBuC2.jpg","original_language":"de","original_title":"Robin Hood","genre_ids":[53,28,18],"backdrop_path":"\/AiKL2VbW5iVHEawJ1DSedsCzFLu.jpg","adult":false,"overview":"En 2016, l'Allemagne subit une crise économique très importante, plongeant le peuple dans la misère. La soeur d'Alex Scholl, un agent spécial, vient d'ailleurs de se suicider ne parvenant plus à subvenir aux besoins de sa fille. Peu après, Alex assiste avec impuissance à l'enrichissement d'un homme d'affaire sur le dos des autres et excédé il décide d'agir... Ainsi, il s'associe alors avec des braqueurs pour voler de l'argent et le distribuer aux plus pauvres.","release_date":"2013-08-20"},{"vote_count":2,"id":295011,"video":false,"vote_average":10,"title":"Patient Zero","popularity":2.589759,"poster_path":"\/4mw8NVeWXpLVk22ojS7clq35FWJ.jpg","original_language":"en","original_title":"Patient Zero","genre_ids":[28,18,27,53],"backdrop_path":null,"adult":false,"overview":"Dans un monde ravagé par une apocalypse zombie, un homme a le pouvoir de communiquer avec les morts-vivants et s'en sert afin de trouver le remède capable de sauver sa femme infectée.","release_date":""},{"vote_count":2,"id":280180,"video":false,"vote_average":10,"title":"Le Flic de Beverly Hills 4","popularity":1.373144,"poster_path":null,"original_language":"en","original_title":"Beverly Hills Cop 4","genre_ids":[28,35],"backdrop_path":null,"adult":false,"overview":"","release_date":""},{"vote_count":2,"id":384681,"video":false,"vote_average":10,"title":"San Andreas 2","popularity":1.974571,"poster_path":null,"original_language":"en","original_title":"San Andreas 2","genre_ids":[28],"backdrop_path":null,"adult":false,"overview":"","release_date":""},{"vote_count":2,"id":448503,"video":false,"vote_average":10,"title":"उन्मत्त","popularity":1.115676,"poster_path":"\/oAWXjjGTrkrdAlSeGGq0IZOwFoF.jpg","original_language":"mr","original_title":"उन्मत्त","genre_ids":[878,28,27,53],"backdrop_path":"\/g1btrWDoWMOl41axD9M2YgpZdve.jpg","adult":false,"overview":"","release_date":""},{"vote_count":2,"id":423204,"video":false,"vote_average":10,"title":"Angel Has Fallen","popularity":2.677834,"poster_path":null,"original_language":"en","original_title":"Angel Has Fallen","genre_ids":[28,53],"backdrop_path":null,"adult":false,"overview":"","release_date":""},{"vote_count":2,"id":432133,"video":false,"vote_average":10,"title":"宇宙戦艦ヤマト2202 愛の戦士たち","popularity":1.649356,"poster_path":"\/jyxZhB5qHKIQ9JJ7J8wWJEH6kcS.jpg","original_language":"ja","original_title":"宇宙戦艦ヤマト2202 愛の戦士たち","genre_ids":[28,16,878],"backdrop_path":"\/AoQgv3akvfYkmvTaWirwHYBM5wI.jpg","adult":false,"overview":"","release_date":"2017-02-25"},{"vote_count":2,"id":418189,"video":false,"vote_average":10,"title":"魔法少女まどか★マギカ コンセプトムービー","popularity":1.198342,"poster_path":"\/vnjxUM0VbXwlFHZGiO8czzJ59kx.jpg","original_language":"ja","original_title":"魔法少女まどか★マギカ コンセプトムービー","genre_ids":[28,16,12,18,14,9648],"backdrop_path":"\/dErtFZfE6reMqDvqwueNQz2VQqJ.jpg","adult":false,"overview":"","release_date":"2015-11-27"},{"vote_count":2,"id":407872,"video":false,"vote_average":10,"title":"LSD Riders - Take it & Love it","popularity":1.131844,"poster_path":"\/lvooPxLVR4mYZuVtTsTy42bMVeN.jpg","original_language":"en","original_title":"LSD Riders - Take it & Love it","genre_ids":[28,35],"backdrop_path":null,"adult":false,"overview":"","release_date":"2005-11-10"},{"vote_count":2,"id":486329,"video":false,"vote_average":10,"title":"Crazy Famous","popularity":1.232317,"poster_path":"\/aVPUS6UTTtSszcCAVT9Ak40AqOr.jpg","original_language":"en","original_title":"Crazy Famous","genre_ids":[28,35],"backdrop_path":"\/bBCIpt8WJfe3Atz7LaphIvhKWmX.jpg","adult":false,"overview":"","release_date":"2017-03-17"},{"vote_count":2,"id":346647,"video":false,"vote_average":10,"title":"Need for Speed 2","popularity":1.081998,"poster_path":null,"original_language":"en","original_title":"Need for Speed 2","genre_ids":[28],"backdrop_path":null,"adult":false,"overview":"","release_date":""},{"vote_count":2,"id":211919,"video":false,"vote_average":10,"title":"Deathrow","popularity":1.180733,"poster_path":"\/sPCoRfLWzhOYlzFXAbZwCMnF5bL.jpg","original_language":"en","original_title":"Deathrow","genre_ids":[28,80,18],"backdrop_path":null,"adult":false,"overview":"","release_date":"2000-01-01"},{"vote_count":2,"id":435862,"video":false,"vote_average":10,"title":"Truenos","popularity":1.121829,"poster_path":"\/n2iLhhMn56XxbQ0Od1fGVgdaZha.jpg","original_language":"es","original_title":"Truenos","genre_ids":[28],"backdrop_path":null,"adult":false,"overview":"","release_date":"2017-01-19"},{"vote_count":2,"id":489427,"video":false,"vote_average":10,"title":"Muhafiz","popularity":1.104364,"poster_path":"\/aZ9FRzzE7DD9zbnBHTrX844uErX.jpg","original_language":"en","original_title":"Muhafiz","genre_ids":[80,28,18],"backdrop_path":null,"adult":false,"overview":"","release_date":"2005-05-23"}]};
            sinon.stub(httpUtils, 'sendHttps')
                .withArgs(urlGetGenres).resolves(dataGenres)
                .withArgs(urlDiscoverMovies).resolves(dataDiscoverMovies);
            it('Doit contenir la liste attendue', () => {
                main.processV1Request(sendMocked);
                console.log(spyList.args[0]);
                expect(spyList.args[0]).toBe(expectedList);
            });
        });
        describe('Je veux voir un film d\'action avec Tom Cruise', () => {
            
        });
        describe('Je veux voir un filme de science-fiction sortie en 2017', () => {
            
        });
        describe('Je cherche un film de JJ Abrams sortie en 2015 et qui se passe dans l\'espace', () => {
            
        });
    });
});