const puppeteer = require('puppeteer');
const CrawlerBase = require('./CrawlerBase');
const ccolors = require('../../utility/ccolors');

class BrowserCrawler extends CrawlerBase {
    constructor(options) {
        super(options);
        this.mode = 'BROWSER';
    }

    async _crawOnce(options) {
        const opt = options || {};
        // const browser = await puppeteer.launch({
        //     args: ['--disable-setuid-sandbox', '--no-sandbox']
        // });
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        if (opt.userAgent && opt.userAgent.userAgentString) {
            await page.setUserAgent(opt.userAgent.userAgentString);
        }
        await page.goto(this.url);
        const perf = JSON.parse(await page.evaluate(() => {
            return JSON.stringify(performance.timing);
        }));
        let result = {
            timing: {}
        };
        if (perf) {
            Object.keys(perf).forEach(key => {
                if (perf[key]) {
                    result.timing[key] = perf[key] - perf.navigationStart;
                }
            });
        }
        await browser.close();
        return Object.keys(result).length ? result : null;
    }

    showResult() {
        let resToDisplay = [];
        let index = 1;
        const total = {
            domainLookupEnd: 0,
            connectEnd: 0,
            requestStart: 0,
            responseStart: 0,
            responseEnd: 0,
            domContentLoadedEventStart: 0,
            domComplete: 0,
            loadEventStart: 0,
            loadEventEnd: 0
        };
        if (this.crawledData && this.crawledData.length) {
            this.crawledData.forEach(value => {
                const timing = value.timing;

                total.domainLookupEnd += timing.domainLookupEnd;
                total.connectEnd += timing.connectEnd;
                total.requestStart += timing.requestStart;
                total.responseStart += timing.responseStart;
                total.responseEnd += timing.responseEnd;
                total.domContentLoadedEventStart += timing.domContentLoadedEventStart;
                total.domComplete += timing.domComplete;
                total.loadEventStart += timing.loadEventStart;
                total.loadEventEnd += timing.loadEventEnd;

                if (this.detail) {
                    resToDisplay.push({
                        index: index++,
                        domainLookupEnd: timing.domainLookupEnd,
                        connectEnd: timing.connectEnd,
                        requestStart: timing.requestStart,
                        responseStart: timing.responseStart,
                        responseEnd: timing.responseEnd,
                        domContentLoaded: timing.domContentLoadedEventStart,
                        domComplete: timing.domComplete,
                        loadEventStart: timing.loadEventStart,
                        loadEventEnd: timing.loadEventEnd
                    });
                }
            });
            const totalCount = this.crawledData.length;
            if (totalCount) {
                resToDisplay.push({
                    index: ccolors.cyan('AVG'),
                    domainLookupEnd: (total.domainLookupEnd / totalCount).toFixed(0),
                    connectEnd: (total.connectEnd / totalCount).toFixed(0),
                    requestStart: (total.requestStart / totalCount).toFixed(0),
                    responseStart: (total.responseStart / totalCount).toFixed(0),
                    responseEnd: (total.responseEnd / totalCount).toFixed(0),
                    domContentLoaded: (total.domContentLoadedEventStart / totalCount).toFixed(0),
                    domComplete: (total.domComplete / totalCount).toFixed(0),
                    loadEventStart: (total.loadEventStart / totalCount).toFixed(0),
                    loadEventEnd: (total.loadEventEnd / totalCount).toFixed(0),

                });
            }
            return super.showResult(resToDisplay);
        }
    }
}

module.exports = BrowserCrawler;
