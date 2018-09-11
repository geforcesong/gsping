const ccolors = require('./utility/ccolors');
const uaJson = require('./configs/ua.json');
const constants = require('./utility/constants');
const path = require('path');
const ParameterError = require('./libs/errors/ParameterError');

class InputMan {
    constructor(args) {
        this.args = args;
    }

    parseOptions() {
        let options = null;
        if (this.args.config) {
            options = this._parseFromFile(this.args.config);
        } else {
            options = this._parseFromInput(this.args);
        }
        this._processDefaultOptions(options);
        this._validateOptions(options);
        return options;
    }

    _parseFromInput(args) {
        let options = {
            isMobile: !!(args.m),
            url: args.u,
            times: args.t,
            ua: args.ua,
            batch: args.batch,
            interval: args.interval,
            existkey: args.existkey,
            regexp: !!(args.regexp),
            detail: !!(args.detail),
            mode: args.mode
        };
        return options;
    }

    _parseFromFile(file) {
        try {
            const filePath = path.resolve(process.cwd(), file);
            console.log(ccolors.magenta(`Loading configuration from ${filePath}`));
            const config = require(filePath);
            return config;
        } catch (err) {
            console.log(ccolors.red(err));
            return null;
        }
    }

    _processDefaultOptions(options) {
        if (!options) {
            return;
        }
        options.isMobile = !!(options.isMobile);
        if (options.ua === true) {
            options.ua = '';
        } else if (!options.ua) {
            options.ua = constants.UA;
        }
        options.ua = this._parseUserAgent(options.ua, options.isMobile);
        if (!options.batch || options.batch < 1) {
            options.batch = constants.BATCH;
        }
        options.times = options.times || 1;
        if (options.regexp) {
            options.existkey = new RegExp(options.existkey);
        }
        if (!options.method) {
            options.method = 'GET';
        }
        options.mode = (options.mode || 'RAW').toUpperCase();
    }

    _validateOptions(options) {
        if (!options) {
            throw new ParameterError('Configuration is not existed.');
        }

        if (!options.url) {
            throw new ParameterError('You must specify a url.');
        }

        if (options.times && isNaN(options.times)) {
            throw new ParameterError('This is not a valid number for times');
        }

        if (options.batch && isNaN(options.batch)) {
            throw new ParameterError('This is not a valid number for batch');
        }

        if ((options.interval && isNaN(options.interval)) || options.interval < 0 || options.interval === true) {
            throw new ParameterError('This is not a valid number for interval');
        }

        if (options.method) {
            options.method = options.method.toUpperCase();
            if (!['GET', 'POST', 'PUT', 'DELETE'].includes(options.method)) {
                throw new ParameterError('This is not a valid http method');
            }
        }

        if (options.mode) {
            if (!['BOTH', 'RAW', 'BROWSER'].includes(options.mode)) {
                throw new ParameterError('This is not a valid mode. Accept BOTH, RAW, BROWSER');
            }
        }
    }

    _parseUserAgent(ua, isMobile) {
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
}

module.exports = InputMan;
