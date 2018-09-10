const ccolors = require('./ccolors');

class Common {
    static async delay(time = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    }

    static getColoredStatus(code) {
        if (!code) {
            return code;
        }
        if (code >= 200 && code < 300) {
            return ccolors.green(code);
        } else if (code >= 300 && code < 400) {
            return ccolors.yellow(code);
        }
        return ccolors.red(code);
    }
}

module.exports = Common;
