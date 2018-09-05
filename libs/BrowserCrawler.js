const puppeteer = require('puppeteer');

class BrowserCrawler {
    constructor(url) {
        this.url = url;
    }

    async crawOnce(options) {
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
        let result = {};
        if(perf){
            Object.keys(perf).forEach(key=>{
                if (perf[key]) {
                    result[key] = perf[key] - perf.navigationStart;
                }
            });
        }
        await browser.close();
        return Object.keys(result).length ? result : null;
    }
}

module.exports = BrowserCrawler;
