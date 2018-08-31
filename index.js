#! /usr/bin/env node
// const request = require('request');
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
    
    let c = new Crawler(args.u);
    c.crawl(times);
})();