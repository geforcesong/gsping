#! /usr/bin/env node
const colors = require('colors/safe');
const minimist = require('minimist');
const Crawler = require('./libs/Crawler');
const args = minimist(process.argv.slice(2));

(async _ => {
    if (!args.u) {
        console.log('you must specify a url to test');
        return;
    }

    const times = args.t;
    if(isNaN(times)){
        console.log('you must valid number as times');
        return;
    }
    console.log(colors.cyan(1111) + colors.red(222));

    console.log();
    console.log(`We are going to crawl this url for ${times} times`);
    console.log(colors.yellow.underline(`The url is: ${args.u}`));
    console.log();
    console.log();
    console.log();

    let c = new Crawler(args.u);
    c.crawl(times);

})();
