const https = require('https');

/**
 * Méthode utilitaire pour l'envois de requêtes https.
 * @param url 
 */
exports.sendHttps = function (url) {
    return new Promise((resolve, reject) => {
        // let urlEncoded = encodeURIComponent(url);
        https.get(url, (res) => {
                console.log('1');
                const {
                    statusCode
                } = res;
                const contentType = res.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error('error response was received', error.message);
                    res.resume();
                    return;
                }
                res.setEncoding('utf8');
                let body = '';
                res.on('data', (d) => body += d);
                res.on('end', () => {
                    try {
                        let resultObject = JSON.parse(body);
                        resolve(resultObject);
                    } catch (e) {
                        console.error('error catched during api call', e.message);
                        reject(e);
                    }
                });
            })
            .on('error', (err) => {
                console.error('on error event', err);
                reject(err);
            });
    });
}