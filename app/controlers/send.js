const { AssistantApp, DialogflowApp } = require('actions-on-google');

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

module.exports = Send;