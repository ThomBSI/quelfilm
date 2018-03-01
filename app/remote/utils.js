const https = require('https');

/**
 * Méthode utilitaire pour l'envois de requêtes https.
 * @param url 
 */
exports.sendHttps = function(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
                let body = '';
                res.on('data', d => body += d);
                res.on('end', () => {
                    let resultObject = JSON.parse(body);
                    resolve(resultObject);
                });
            })
            .on('error', err => reject(err));
    });
}