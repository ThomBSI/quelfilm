const { DialogflowApp } = require('actions-on-google');

class Send {

    /**
     * @param {{request: Request, response: Response}} options
     */
    constructor(options) {
        this.request = options.request;
        this.response = options.response;
        this.app = new DialogflowApp(options);
    }

    sendSimpleResponse(response) {
        this.app.ask(response);
    }

    sendResponseWithList(prompt, response) {
        this.app.askWithList(prompt, response);
    }

    sendResponseWithEvent(eventName, eventParameters) {
        this.response.json({
            'followupEvent': {
                'name': eventName,
                'data': eventParameters
            }
        });
    }
}
module.exports.Send = Send;