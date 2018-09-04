#! /usr/bin/env node
const minimist = require('minimist');
const Crawler = require('./libs/Crawler');
const uaJson = require('./configs/ua.json');
const pkg = require('./package.json');

(async _ => {
    const args = minimist(process.argv.slice(2));
    if(args.v){
        console.log(`gsping is running in version ${pkg.version}`);
        return;
    }

    let options = null;
    if(args.config){
        options = parseInputFromFile(args.config);
    } else{
        options = parseInput(args);
    }

    if (!options) {
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
        batch: inputs.batch || 1,
        interval: inputs.interval || 0,
        existkey: inputs.existkey
    };

    if (!options.url) {
        console.log('You must specify a url.');
        return null;
    }

    if (options.times && isNaN(options.times)) {
        console.log('This is not a valid number for times -t');
        return null;
    }

    if (options.batch && isNaN(options.batch)) {
        console.log('This is not a valid number for batch count --batch');
        return null;
    }

    if (!options.batch || options.batch < 1) {
        options.batch = 1;
    }

    if ((options.interval && isNaN(options.interval)) || options.interval < 0) {
        console.log('This is not a valid number for interval --interval');
        return null;
    }

    if (options.ua === true) {
        options.ua = '';
    } else if (!options.ua) {
        options.ua = 'chrome';
    }
    options.ua = parseUserAgent(options.ua, options.isMobile);
    return options;
}

function parseUserAgent(ua, isMobile) {
    let uaSetting = isMobile ? uaJson.mobile : uaJson.desktop;
    if (Object.keys(uaSetting).includes(ua)) {
        return {
            name: ua,
            userAgentString: uaSetting[ua]
        };
    }
    return {
        name: 'custom',
        userAgentString: ua
    };
}

function parseInputFromFile(file){
    try{
        const config = require(file);
        if(!config.ua){
            config.ua = 'chrome';
        }
        config.isMobile = !!(config.isMobile);
        config.ua = parseUserAgent(config.ua, config.isMobile);
        validateConfig(config);
        return config;
    } catch(err){
        console.log(err);
        return null;
    }
}

function validateConfig(config){
    if(!config){
        throw new Error('Configuration is not existed.');
    }
}
