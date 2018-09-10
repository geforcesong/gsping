const puppeteer = require('puppeteer');
const CrawlerBase = require('./CrawlerBase');

class BrowserCrawler extends CrawlerBase {
    constructor(options) {
        super(options);
        this.mode = 'BROWSER';
    }

    async _crawOnce(options) {
        const opt = options  || {};
        // const browser = await puppeteer.launch({
        //     args: ['--disable-setuid-sandbox', '--no-sandbox']
        // });
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        if(opt.userAgent && opt.userAgent.userAgentString){
            await page.setUserAgent(opt.userAgent.userAgentString);
        }
        await page.goto(this.url);
        const perf = JSON.parse(await page.evaluate(() => {
            return JSON.stringify(performance.timing);
        }));
        let result = {
            timing: {}
        };
        if(perf){
            Object.keys(perf).forEach(key=>{
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
    }
}

module.exports = BrowserCrawler;
