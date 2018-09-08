const CrawlerBase = require('./CrawlerBase');
const request = require('request');
const Common = require('../../utility/common');
class RawCrawler extends CrawlerBase {
    constructor(options) {
        options.mode = 'RAW';
        super(options);
    }

    async _crawOnce() {
        let self = this;
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'User-Agent': self.userAgent && self.userAgent.userAgentString
                },
                uri: this.url,
                method: this.method || 'GET',
                body: this.body || undefined,
                time: true,
                followRedirect: false
            }, (err, resp) => {
                if (err) {
                    return reject(err);
                }
                if (!resp.timings || !resp.timingPhases) {
                    return resolve(null);
                }
                let result = {
                    timing: {
                        firstByte: resp.timingPhases.firstByte,
                        responseTotal: resp.timings.end,
                        dnsLookup: resp.timings.lookup,
                        connect: resp.timings.connect,
                        socket: resp.timings.socket
                    },
                    statusCode: resp.statusCode || 'NAN'
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

    async crawl() {
        let processedCount = 0;
        const batchCount = this.batchCount;
        while (processedCount < this.times) {
            let batchPromises = [];
            for (var i = processedCount; i < (processedCount + batchCount) && i < this.times; i++) {
                batchPromises.push(this._crawOnce());
                this.showProgress(i + 1, this.times);
            }
            let ret = await Promise.all(batchPromises);
            if (ret && ret.length) {
                this.crawledData = this.crawledData.concat(ret);
            }
            processedCount += this.batchCount;
            if (processedCount < this.times && this.interval) {
                await Common.delay(this.interval);
            }
        }
        console.log();
        console.log('Crawl finished waiting for the results...');
    }

    showResult(){
        if(!this.crawledData || !this.crawledData.length){
            return;
        }

    }
}

module.exports = RawCrawler;
