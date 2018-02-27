const sinon = require('sinon');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const handler = require('../../controlers/v1RequestHandler');
const actionHandler = require('../../controlers/actionHandlers');

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
            stubFunctionSuccess = function() {
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
            stubFunctionFail = function() {
                return new Promise((resolve, reject) => {
                    spyDialogflowAppAsk();
                    reject(apiFailResponse);
                });
            };
            stubActionHandler.withArgs('input.test').returns(stubFunctionFail);
            handler.processV1Request(fakeRequest, fakeResponse);
            expect(spyDialogflowAppAsk.calledOnce).toBe(true);
        });
        afterEach(() => {
            stubActionHandler.restore();
        });
    });
});