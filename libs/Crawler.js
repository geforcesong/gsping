const request = require('request');
const CrawlerLogger = require('./CrawlerLogger');
const colors = require('colors/safe');
const userAgent = require('./ua.json');

const RED = colors.green;
class Crawler {
    constructor(options) {
        this.url = options.url;
        this.isMobile = options.isMobile;
        options.ua = options.ua || 'chrome';
        if (!this._isValidUA(options.ua)) {
            throw new Error('ua parameter is invalid!');
        }
        this.userAgent = options.isMobile ? userAgent.mobile[options.ua] : userAgent.desktop[options.ua];
    }

    _isValidUA(ua, isMobile) {
        if (isMobile) {
            return Object.keys(userAgent.mobile).includes(ua);
        }
        return Object.keys(userAgent.desktop).includes(ua);
    }

    async crawl(options) {
        let round = (!options.times || options.times < 1) ? 1 : options.times;
        let crawlerLogger = new CrawlerLogger(['socket', 'dnsLookup', 'connect', 'firstByte', 'responseTotal']);
        for (var i = 0; i < round; i++) {
            let ret = await this._crawOnce();
            crawlerLogger.add(ret);
        }
    }

    async _crawOnce() {
        let self = this;
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
                if (resp.statusCode !== 200) {
                    console.log(RED(`Error in url(${self.url}), status: ${resp.statusCode}`));
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
