const sinon = require('sinon');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const handler = require('../../../app/controlers/v1RequestHandler');
const actionHandler = require('../../../app/controlers/actionHandlers');

describe('v1RequestHandler', () => {
    describe('#processV1Request', () => {
        let apiSuccesResponse = {speech: 'success'};
        let apiFailResponse = {speech: 'fail'};
        let stubFunctionSuccess, stubFunctionFail;
        let spyDialogflowAppAsk, stubActionHandler;
        let fakeRequest = {
            body: {
                result: {
                    action: 'input.test',
                    parameters: '',
                    contexts: ''
                }
            }
        };
        let fakeResponse;
        beforeEach(() => {
            stubActionHandler = sinon.stub(actionHandler, 'actionHandlers');
            spyDialogflowAppAsk = sinon.spy();
        });
        it('Doit être une fonction', () => {
            expect(handler.processV1Request).toEqual(jasmine.any(Function));
        });
        it('Doit retourner la réponse remonté de l\'actionHandler en cas de succès', () => {
            stubFunctionSuccess = function(params) {
                return new Promise((resolve, reject) => {
                    spyDialogflowAppAsk();
                    resolve(apiSuccesResponse);
                });
            };
            stubActionHandler.withArgs('input.test').returns(stubFunctionSuccess);
            handler.processV1Request(fakeRequest, fakeResponse);
            expect(spyDialogflowAppAsk.calledOnce).toBe(true);
        });
        it('Doit retourner la réponse d\'erreur remonté de l\'actionHandler en cas d\'erreur', () => {
            stubFunctionFail = function(params) {
                return new Promise((resolve, reject) => {
                    spyDialogflowAppAsk();
                    reject(apiFailResponse);
                });
            };
            stubActionHandler.withArgs('input.test').returns(stubFunctionFail);
            handler.processV1Request(fakeRequest, fakeResponse);
            expect(spyDialogflowAppAsk.calledOnce).toBe(true);
        });
        xit('Doit appeller la méthode ask si la réponse est une chaine de caractères', () => {// TODO: Doit appeller la méthode ask si la réponse est une chaine de caractères
            let stubFunction = function() {
                return new Promise((resolve, reject) => {
                    resolve('Simple chaine de caractères');
                });
            };

            const Test = require('../../../app/controlers/test');
            let test = new Test();
            let spyTest = sinon.spy(test, 'methode');

            stubActionHandler.withArgs('input.test').returns(stubFunction);
            // let spyAsk = sinon.spy(DialogflowApp.prototype, 'ask');
            handler.processV1Request(fakeRequest, fakeResponse, test);
            expect(spyTest.called).toBe(true);
            spyTest.restore();
        });
        xit('Doit appeller la méthode ask si la réponse est une SimpleResponse', () => {// TODO: Doit appeller la méthode ask si la réponse est une SimpleResponse
            
        });
        xit('Doit appeller la méthode ask si la réponse est une RichResponse', () => {// TODO: Doit appeller la méthode ask si la réponse est une RichResponse
            
        });
        xit('Doit appeller la méthode askWithList si la réponse est une List', () => {// TODO: Doit appeller la méthode askWithList si la réponse est une List
            
        });
        afterEach(() => {
            stubActionHandler.restore();
        });
    });
});