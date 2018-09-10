#! /usr/bin/env node
const minimist = require('minimist');
const RawCrawler = require('./libs/crawlers/RawCrawler');
const BrowserCrawler = require('./libs/crawlers/BrowserCrawler');
const pkg = require('./package.json');
const InputMan = require('./inputMan');
const helps = require('./help.json');
const columnify = require('columnify');
const ccolors = require('./utility/ccolors');
const ParameterError = require('./libs/errors/ParameterError');

(async _ => {
    const args = minimist(process.argv.slice(2));
    if (args.v) {
        console.log(`gsping is running in version ${pkg.version}`);
        return;
    }

    let options = null;
    try {
        const inputMan = new InputMan(args);
        options = inputMan.parseOptions();
        if (!options) {
            return showHelp();
        }
    } catch (err) {
        if (err.constructor === ParameterError) {
            console.log(ccolors.red(err.message));
            showHelp();
        } else {
            console.log(err);
        }
        return;
    }
    try {
        if (options.mode !== 'BROWSER') {
            let raw = new RawCrawler(options);
            raw.showCrawlerInfo();
            await raw.crawl();
            raw.showResult();
        }

        if (options.mode !== 'RAW') {
            let browser = new BrowserCrawler(options);
            browser.showCrawlerInfo();
            await browser.crawl();
            browser.showResult();
        }
    } catch (err) {
        console.log(err);
    }
})();

function showHelp() {
    console.log(ccolors.yellow('Look like you need set correct parameters, please check the below usage:'));
    console.log('You can also go to https://www.npmjs.com/package/gsping for more details.');
    console.log();
    console.log(columnify(helps, {
        minWidth: 15,
        config: {
            comment: { maxWidth: 70 }
        }
    }));

    console.log();
    console.log('Command example: gsping -u https://example.com --interval 3000 -t 10 --batch 3 --detail');
    console.log(' Config example: gsping --config ./gsping.config.json');
    console.log();
}
