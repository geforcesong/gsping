#! /usr/bin/env node
const minimist = require('minimist');
const Crawler = require('./libs/Crawler');
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
        let c = new Crawler(options);
        await c.crawl();
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
}
