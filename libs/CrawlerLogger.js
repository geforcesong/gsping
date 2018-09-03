const colors = require('colors/safe');
const GREEN = colors.green;
const RED = colors.red;
class Logger {
    constructor() {
        this.sumData = new Map();
        this.crawledCount = 0;
    }

    add(data) {
        if (!data || !data.timing) {
            return;
        }
        this.crawledCount++;

        let self = this;
        let strResult = '';
        let timingObj = data.timing;
        Object.keys(timingObj).forEach((field) => {
            const timeValue = timingObj[field];
            if (self.sumData.has(field)) {
                let old = self.sumData.get(field);
                self.sumData.set(field, old + timeValue);
            } else {
                self.sumData.set(field, timeValue);
            }
        });

        strResult += `Socket:${timingObj.socket.toFixed(2)} `;
        strResult += `DnsLookup:${timingObj.dnsLookup.toFixed(2)} `;
        strResult += `Connect:${timingObj.connect.toFixed(2)} `;
        strResult += `FirstByte:${timingObj.firstByte.toFixed(2)} `;
        strResult += `ResponseTotal:${timingObj.responseTotal.toFixed(2)} `;

        if (data.existkeyCheckResult) {
            strResult += ` keycheck: ${data.existkeyCheckResult.includes('NOT') ? RED(data.existkeyCheckResult) : GREEN(data.existkeyCheckResult)}, key is ${data.existkey}.`;
        }
        console.log(`${this.crawledCount}. ${strResult}`);
    }

    showAvg(){
        let summary = 'AVG - ';
        summary += ` Socket: ${GREEN((this.sumData.get('socket') / this.crawledCount).toFixed(0))}`;
        summary += ` DnsLookup: ${GREEN((this.sumData.get('dnsLookup') / this.crawledCount).toFixed(0))}`;
        summary += ` Connect: ${GREEN((this.sumData.get('connect') / this.crawledCount).toFixed(0))}`;
        summary += ` FirstByte: ${GREEN((this.sumData.get('firstByte') / this.crawledCount).toFixed(0))}`;
        summary += ` ResponseTotal: ${GREEN((this.sumData.get('responseTotal') / this.crawledCount).toFixed(0))}`;
        console.log(colors.gray(summary));
    }
}

module.exports = Logger;
