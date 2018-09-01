const request = require('request');
const CrawlerLogger = require('./CrawlerLogger');
const colors = require('colors/safe');
const RED = colors.green;

class Crawler {
    constructor(options) {
        this.url = options.url;
        this.isMobile = options.isMobile;
        this.userAgent = options.ua;
        this.times = options.times;
    }

    _showCrawlInfo() {
        console.log(`Crawling Url: ${this.url}, total round ${this.times}.`);
        console.log(`user-agent-${this.isMobile ? 'mobile' : 'desktop'}-${this.userAgent.name}:${this.userAgent.userAgentString}`);
        console.log();
    }

    async crawl() {
        this._showCrawlInfo();
        let crawlerLogger = new CrawlerLogger(['socket', 'dnsLookup', 'connect', 'firstByte', 'responseTotal']);
        for (var i = 0; i < this.times; i++) {
            let ret = await this._crawOnce();
            crawlerLogger.add(ret);
        }
    }

    async _crawOnce() {
        let self = this;
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'user-agent': self.userAgent
                },
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
