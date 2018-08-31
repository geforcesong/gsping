const request = require('request');
const CrawlerLogger = require('./CrawlerLogger');

class Crawler {
    constructor(url) {
        this.url = url;
    }

    async crawl(times) {
        let round = (!times || times < 1) ? 1 : times;
        let crawlerLogger = new CrawlerLogger(['socket', 'dnsLookup', 'connect', 'firstByte', 'responseTotal']);
        for (var i = 0; i < round; i++) {
            let ret = await this._crawOnce();
            crawlerLogger.add(ret);
        }
    }

    async _crawOnce() {
        return new Promise((resolve, reject) => {
            request({
                uri: this.url,
                method: 'GET',
                time: true
            }, (err, resp) => {
                if (err) {
                    return reject(err);
                }
                if (!resp.timings || !resp.timingPhases) {
                    return resolve(null);
                }
                return resolve({
                    firstByte: resp.timingPhases.firstByte,
                    responseTotal: resp.timings.end,
                    dnsLookup: resp.timings.lookup,
                    connect: resp.timings.connect,
                    socket: resp.timings.socket
                });
            });
        });
    }
}

module.exports = Crawler;