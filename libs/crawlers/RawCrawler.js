const CrawlerBase = require('./CrawlerBase');
const request = require('request');
const ccolors = require('../../utility/ccolors');
const Common = require('../../utility/common');

class RawCrawler extends CrawlerBase {
    constructor(options) {
        super(options);
    }

    async crawlSingleUrl() {
        let processedCount = 0;
        const batchCount = this.batchCount;
        while (processedCount < this.times) {
            let batchPromises = [];
            for (var i = processedCount; i < (processedCount + batchCount) && i < this.times; i++) {
                batchPromises.push(this._crawOnce(this.url));
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
        console.log();
    }

    async crawlMultipleUrls() {
        for (let processedTime = 0; processedTime < this.times; processedTime++) {
            let batchPromises = [];
            let batchCount = Math.min(this.batchCount, this.url.length);
            const indexes = Common.getRandom0ToMaxNums(this.url.length - 1, batchCount);
            console.log(`Crawling round: ${processedTime + 1}`);
            for (let index of indexes) {
                const cUrl = this.url[index];
                batchPromises.push(this._crawOnce(cUrl));
                console.log(`Crawling url: ${cUrl}`);
            }
            let ret = await Promise.all(batchPromises);
            if (ret && ret.length) {
                this.crawledData = this.crawledData.concat(ret);
            }
            if (this.interval) {
                await Common.delay(this.interval);
            }
        }
        console.log();
        console.log('Crawl finished waiting for the results...');
        console.log();
    }

    async crawl(){
        if(this.mode === 'String'){
            return await this.crawlSingleUrl();
        }
        return await this.crawlMultipleUrls();
    }

    async _crawOnce(url) {
        let self = this;
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'User-Agent': self.userAgent && self.userAgent.userAgentString
                },
                uri: url,
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

    showResult() {
        let resToDisplay = [];
        let index = 1;
        const total = {
            dnsLookup: 0,
            connect: 0,
            firstByte: 0,
            responseTotal: 0
        };
        const totalCount = this.crawledData.length;
        if (this.crawledData && this.crawledData.length) {
            this.crawledData.forEach(value => {
                total.dnsLookup += value.timing.dnsLookup;
                total.connect += value.timing.connect;
                total.firstByte += value.timing.firstByte;
                total.responseTotal += value.timing.responseTotal;
                if (this.detail) {
                    resToDisplay.push({
                        index: index++,
                        statusCode: Common.getColoredStatus(value.statusCode),
                        dnsLookup: value.timing.dnsLookup.toFixed(0),
                        connect: value.timing.connect.toFixed(0),
                        firstByte: value.timing.firstByte.toFixed(0),
                        responseTotal: value.timing.responseTotal.toFixed(0),
                        checked: value.existkeyCheckResult === 'FOUND' ? ccolors.green(value.existkeyCheckResult) : ccolors.red(value.existkeyCheckResult)
                    });
                }
            });
        }
        if (totalCount) {
            resToDisplay.push({
                index: ccolors.cyan('AVG'),
                statusCode: '-',
                dnsLookup: ccolors.cyan((total.dnsLookup / totalCount).toFixed(0)),
                connect: ccolors.cyan((total.connect / totalCount).toFixed(0)),
                firstByte: ccolors.cyan((total.firstByte / totalCount).toFixed(0)),
                responseTotal: ccolors.cyan((total.responseTotal / totalCount).toFixed(0)),
                checked: '-'
            });
        }

        if (!this.existkey) {
            resToDisplay.forEach((v) => {
                delete v.checked;
            });
        }
        return super.showResult(resToDisplay);
    }
}

module.exports = RawCrawler;
