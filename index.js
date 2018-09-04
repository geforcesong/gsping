#! /usr/bin/env node
const minimist = require('minimist');
const Crawler = require('./libs/Crawler');
const pkg = require('./package.json');
const InputMan = require('./inputMan');

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
        console.log(err);
        return showHelp();
    }
    try {
        let c = new Crawler(options);
        await c.crawl();
    } catch (err) {
        console.log(err);
    }
})();

function showHelp() {
    console.log('use -v show current running version.');
    console.log('use -u <url> to specify a url to test');
    console.log('use -t <number> to indicate how many times');
    console.log('use -m to use mobile user agent');
    console.log('use --batch to set batch crawling count');
    console.log('use --existkey this is keyword to check if it exists in response.');
    console.log('use --interval to set crawling interval time in miliseconds');
    console.log('use --ua <useragent> to indicate what ua you want to use. valid values: chrome(default), googlebot');
}

function parseInput(inputs) {
    let options = {
        isMobile: !!(inputs.m),
        url: inputs.u,
        times: inputs.t || 1,
        ua: inputs.ua,
        batch: inputs.batch || defaultBatch,
        interval: inputs.interval || 0,
        existkey: inputs.existkey
    };








    return options;
}
