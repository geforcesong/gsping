const request = require('request');
const CrawlerLogger = require('./CrawlerLogger');
const ccolors = require('../utility/ccolors');
const Common = require('../utility/common');

class Crawler {
    constructor(options) {
        this.url = options.url;
        this.isMobile = options.isMobile;
        this.userAgent = options.ua;
        this.times = options.times;
        this.batchCount = options.batch;
        this.interval = options.interval;
        this.existkey = options.existkey;
    }

    _showCrawlInfo() {
        let info = `Crawling Url: ${this.url}, total round ${this.times}. `;
        if (this.batchCount !== 10000000) {
            info += `batch: ${this.batchCount}. `;
        }
        if (this.interval) {
            info += `interval: ${this.interval}. `;
        }
        console.log(info);
        console.log(`user-agent-${this.isMobile ? 'mobile' : 'desktop'}-${this.userAgent.name}: ${this.userAgent.userAgentString}`);
        console.log();
    }

    async crawl() {
        this._showCrawlInfo();
        let crawlerLogger = new CrawlerLogger();

        let processedCount = 0;
        while (processedCount < this.times) {
            let batchPromises = [];
            for (var i = processedCount; i < (processedCount + this.batchCount) && i < this.times; i++) {
                batchPromises.push(this._crawOnce());
            }
            let ret = await Promise.all(batchPromises);
            if (ret && ret.length) {
                ret.forEach((r) => {
                    if (r) {
                        crawlerLogger.add(r);
                    }
                });
            }
            processedCount += this.batchCount;
            crawlerLogger.showAvg();
            if (processedCount < this.times && this.interval) {
                await Common.delay(this.interval);
            }
        }
    }

    async _crawOnce() {
        let self = this;
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'User-Agent': self.userAgent && self.userAgent.userAgentString
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
                    console.log(ccolors.red(`Error in url(${self.url}), status: ${resp.statusCode}`));
                }
                let result = {
                    timing: {
                        firstByte: resp.timingPhases.firstByte,
                        responseTotal: resp.timings.end,
                        dnsLookup: resp.timings.lookup,
                        connect: resp.timings.connect,
                        socket: resp.timings.socket
                    }
                };
                if (resp.body && self.existkey) {
                    result.existkey = self.existkey;
                    let existFlag = (typeof self.existkey === 'string' ? resp.body.includes(self.existkey) : self.existkey.test(resp.body));
                    result.existkeyCheckResult = existFlag ? 'FOUND' : 'NOT FOUND';
                }
                return resolve(result);
            });
        });
    }
}

module.exports = Crawler;
