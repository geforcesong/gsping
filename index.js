#! /usr/bin/env node
const colors = require('colors/safe');
const minimist = require('minimist');
const Crawler = require('./libs/Crawler');
const args = minimist(process.argv.slice(2));

(async _ => {
    if (!args.u) {
        console.log('you must specify a url to test by using -u <url>');
        console.log('use -t <number> to indicate how many times');
        return;
    }

    const times = args.t;
    if (isNaN(times)) {
        console.log('you must valid number as times.');
        return;
    }

    const isMobile = !!(args.m);
    const ua = args.ua;

    console.log();
    console.log(`We are going to crawl this url for ${times} times`);
    console.log(colors.yellow.underline(`The url is: ${args.u}`));
    console.log();
    console.log();
    console.log();

    let c = new Crawler({ url: args.u, isMobile, ua });
    c.crawl(times);

})();
