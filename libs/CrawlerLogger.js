const colors = require('colors/safe');
const green = colors.green;
const red = colors.red;
const gray = colors.gray;
const validateInput = Symbol('VALIDATEINPUT');

class Logger {
    constructor() {
        this.sumData = new Map();
        this.crawledCount = 0;
    }

    [validateInput](data){
        if(!data || !data.timing || Object.keys(data.timing).length !== 5){
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

        strResult += ` Socket: ${timingObj.socket.toFixed(2)}`.padEnd(20);
        strResult += ` DnsLookup: ${timingObj.dnsLookup.toFixed(2)}`.padEnd(20);
        strResult += ` Connect: ${timingObj.connect.toFixed(2)}`.padEnd(20);
        strResult += ` FirstByte: ${timingObj.firstByte.toFixed(2)}`.padEnd(20);
        strResult += ` ResponseTotal: ${timingObj.responseTotal.toFixed(2)}`.padEnd(25);

        if (data.existkeyCheckResult) {
            strResult += ` keycheck: ${data.existkeyCheckResult.includes('NOT') ? red(data.existkeyCheckResult) : green(data.existkeyCheckResult)}, key is ${data.existkey}.`;
        }
        console.log(`${this.crawledCount}.`.padEnd(4) + ` ${strResult}`);
    }

    showAvg() {
        if(!this.sumData.size){
            console.log(red('There is no data to show!!!'));
            return;
        }
        let summary = 'AVG - ';
        summary += ` Socket: ${green((this.sumData.get('socket') / this.crawledCount).toFixed(0))}`;
        summary += ` DnsLookup: ${green((this.sumData.get('dnsLookup') / this.crawledCount).toFixed(0))}`;
        summary += ` Connect: ${green((this.sumData.get('connect') / this.crawledCount).toFixed(0))}`;
        summary += ` FirstByte: ${green((this.sumData.get('firstByte') / this.crawledCount).toFixed(0))}`;
        summary += ` ResponseTotal: ${green((this.sumData.get('responseTotal') / this.crawledCount).toFixed(0))}`;
        console.log(gray(summary));
    }
}

module.exports = Logger;
