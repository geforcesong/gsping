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

    static getRandom0ToMaxNums(max, count) {
        const list = [];
        for (var i = 0; i <= max; i++) {
            list.push(i);
        }
        return Common.shuffle(list).slice(0, count);
    }

    static shuffle(array) {
        let counter = array.length, temp, index;
        while (counter--) {
            // Pick a random index
            index = (Math.random() * (counter + 1)) | 0;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
}

module.exports = Common;
