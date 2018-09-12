const request = require('request');
const puppeteer = require('puppeteer');
const url = 'https://www.google.com';

async function fromRequest() {
    return new Promise((resolve, reject) => {
        request({
            uri: url,
            method: 'GET',
            time: true
        }, (err, resp) => {
            if (err) {
                return reject(err);
            }
            if (!resp.timings || !resp.timingPhases) {
                return resolve(null);
            }
            return resolve(resp);
        });
    });
}

async function fromHeadless() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const perf = JSON.parse(await page.evaluate(() => {
        return JSON.stringify(performance.timing);
    }));
    await browser.close();
    return perf;
}


(async _ => {
    const ret1 = await fromRequest();
    console.log(`request first byte: ${ret1.timingPhases.firstByte}`);
    const ret2 = await fromHeadless();
    console.log(`headless chrome first byte: ${ret2.responseStart - ret2.navigationStart}`);
})();
