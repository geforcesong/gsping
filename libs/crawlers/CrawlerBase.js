const ccolors = require('../../utility/ccolors');
var readline = require('readline');
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
        this.mode = options.mode || 'RAW';
        this.crawledData = [];
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
}

module.exports = CrawlerBase;
