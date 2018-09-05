// Console color
const colors = require('colors/safe');
const basecolor = Symbol('basecolor');

class CColor {

    static [basecolor](color, input, options) {
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
        return colors[color](ipt);
    }

    static green(input, options) {
        return CColor[basecolor]('green', input, options);
    }

    static red(input, options) {
        return CColor[basecolor]('red', input, options);
    }

    static magenta(input, options) {
        return CColor[basecolor]('magenta', input, options);
    }

    static blue(input, options) {
        return CColor[basecolor]('blue', input, options);
    }
}

module.exports = CColor;