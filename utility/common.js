class Common {
    static async delay(time = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    }
}

module.exports = Common;
