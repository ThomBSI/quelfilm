const { AssistantApp, DialogflowApp } = require('actions-on-google');

/**
 * 
 * @param {{request: e.Request, response: e.Response}} options 
 */
function Send(options) {
    this.request = options.request;
    this.response = options.response;
    this.app = new DialogflowApp(options);
}

Send.prototype.sendSimpleResponse = function(response) {
    this.app.ask(response);
}

Send.prototype.sendResponseWithList = function(prompt, response) {
    this.app.askWithList(prompt, response);
}

Send.prototype.sendResponseWithEvent = function(eventName, eventParameters) {
    this.response.json({
        'followupEvent': {
            'name': eventName,
            'data': eventParameters
        }
    });
}

module.exports = Send;