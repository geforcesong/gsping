const ccolors = require('../../utility/ccolors');
const readline = require('readline');
const columnify = require('columnify');
const Common = require('../../utility/common');

class CrawlerBase {
    constructor(options) {
        this.url = options.url;
        this.isMobile = options.isMobile;
        this.userAgent = options.ua;
        this.times = options.times;
        this.batchCount = options.batch;
        this.interval = options.interval;
        this.existkey = options.existkey;
        this.method = options.method;
        this.body = options.body;
        this.crawledData = [];
        this.detail = options.detail;
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
        console.log();
    }


    showCrawlerInfo() {
        let info = `${this.mode} Crawling Url ${ccolors.cyan(this.method)}: ${ccolors.yellow(this.url)}, total round ${this.times}. `;
        if (this.batchCount) {
            info += `batch: ${this.batchCount}. `;
        }
        if (this.interval) {
            info += `interval: ${this.interval}. `;
        }
        console.log(info);
        console.log(`user-agent-${this.isMobile ? 'mobile' : 'desktop'}-${this.userAgent.name}: ${this.userAgent.userAgentString}`);
        if (this.existkey && this.mode === 'RAW') {
            console.log(`Will check whether the response contains ${ccolors.cyan(this.existkey)}`);
        }
        console.log();
    }

    showProgress(processed, total) {
        if (!processed || !total) {
            return;
        }
        let clength = total.toString().length;
        const processedStr = processed.toString().padStart(clength);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Waiting for process analysis ... ${processedStr} of ${total} finished.`);
    }

    showResult(results) {
        if (!results || !results.length) {
            console.log(ccolors.yellow('There is nothing to display, result is not existed'));
            return;
        }
        const content = columnify(results);
        console.log(content);
    }
}

module.exports = CrawlerBase;
