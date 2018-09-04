// Console color
const colors = require('colors/safe');
const green = colors.green;
const red = colors.red;
// const gray = colors.gray;

class CColor {
    static green(input, options) {
        if (!input) {
            return '';
        }
        let ipt = input;
        if (typeof (ipt) !== 'string') {
            ipt = ipt.toString();
        }
        if (options) {
            if (options.padEnd) {
                ipt = ipt.padEnd(options.padEnd);
            }
            if (options.padStart) {
                ipt = ipt.padStart(options.padStart);
            }
        }
        return green(ipt);
    }

    static red(input, options) {
        if (!input) {
            return '';
        }
        let ipt = input;
        if (typeof (ipt) !== 'string') {
            ipt = ipt.toString();
        }
        if (options) {
            if (options.padEnd) {
                ipt = ipt.padEnd(options.padEnd);
            }
            if (options.padStart) {
                ipt = ipt.padStart(options.padStart);
            }
        }
        return red(ipt);
    }
}

module.exports = CColor;