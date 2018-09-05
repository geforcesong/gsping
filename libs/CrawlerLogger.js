const ccolor = require('../utility/ccolors');
const validateInput = Symbol('VALIDATEINPUT');

class Logger {
    constructor() {
        this.sumData = new Map();
        this.crawledCount = 0;
    }

    [validateInput](data) {
        if (!data || !data.timing || Object.keys(data.timing).length !== 5) {
            return false;
        }
        return true;
    }

    add(data) {
        if (!data || !this[validateInput](data)) {
            return;
        }
        this.crawledCount++;

        const self = this;
        const timingObj = data.timing;
        Object.keys(timingObj).forEach((field) => {
            const timeValue = timingObj[field];
            if (self.sumData.has(field)) {
                let old = self.sumData.get(field);
                self.sumData.set(field, old + timeValue);
            } else {
                self.sumData.set(field, timeValue);
            }
        });

        this.showRecord(data);
    }

    showRecord(data) {
        let strResult = '';
        const timingObj = data.timing;
        let statusCode = data.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
            statusCode = ccolor.green(statusCode);
        } else if (statusCode >= 300 && statusCode < 400) {
            statusCode = ccolor.yellow(statusCode);
        } else {
            statusCode = ccolor.red(statusCode);
        }

        strResult += ` ${statusCode}`.padEnd(5);
        strResult += ` DnsLookup: ${timingObj.dnsLookup.toFixed(2)}`.padEnd(20);
        strResult += ` Connect: ${timingObj.connect.toFixed(2)}`.padEnd(20);
        strResult += ` FirstByte: ${timingObj.firstByte.toFixed(2)}`.padEnd(23);
        strResult += ` ResponseTotal: ${timingObj.responseTotal.toFixed(2)}`.padEnd(25);

        if (data.existkeyCheckResult) {
            strResult += ` keycheck: ${data.existkeyCheckResult.includes('NOT') ? ccolor.red(data.existkeyCheckResult) : ccolor.green(data.existkeyCheckResult)}, key is ${data.existkey}.`;
        }
        console.log(`${this.crawledCount}.`.padEnd(4) + ` ${strResult}`);
    }

    showAvg() {
        if (!this.sumData.size) {
            console.log(ccolor.red('There is no data to show!!!'));
            return;
        }
        let summary = ccolor.yellow('avg -'.padEnd(9));
        // summary += ` Socket: ${ccolor.green((this.sumData.get('socket') / this.crawledCount).toFixed(0), { padEnd: 11 })}`;
        summary += ` DnsLookup: ${ccolor.green((this.sumData.get('dnsLookup') / this.crawledCount).toFixed(0), { padEnd: 8 })}`;
        summary += ` Connect: ${ccolor.green((this.sumData.get('connect') / this.crawledCount).toFixed(0), { padEnd: 10 })}`;
        summary += ` FirstByte: ${ccolor.green((this.sumData.get('firstByte') / this.crawledCount).toFixed(0), { padEnd: 11 })}`;
        summary += ` ResponseTotal: ${ccolor.green((this.sumData.get('responseTotal') / this.crawledCount).toFixed(0), { padEnd: 10 })}`;
        console.log(ccolor.gray(summary));
    }
}

module.exports = Logger;
