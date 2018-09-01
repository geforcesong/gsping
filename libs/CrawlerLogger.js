const colors = require('colors/safe');
const GREEN = colors.green;
const RED = colors.red;
class Logger {
    constructor(fields) {
        this.fields = fields;
        this.sumData = {};
        fields.forEach(element => {
            this.sumData['sum_' + element] = 0;
        });
        this.dataList = [];
    }

    add(data) {
        if (!data) {
            return;
        }
        let self = this;
        this.dataList.push(data);
        let count = this.dataList.length;
        let strResult = '';
        let timingObj = data.timing;
        this.fields.forEach((el) => {
            self.sumData['sum_' + el] += timingObj[el];
            strResult += `${el}: ${timingObj[el].toFixed(2)}. `;
        });
        console.log(`${count}. ${strResult}`);
        let summary = `Avg FirstByte: ${GREEN((this.sumData['sum_firstByte'] / count).toFixed(0))}, Avg ResponseTotal: ${GREEN((this.sumData['sum_responseTotal'] / count).toFixed(0))}.`;
        if (data.existkeyCheckResult) {
            summary += ` keycheck: ${data.existkeyCheckResult.includes('NOT') ? RED(data.existkeyCheckResult) : GREEN(data.existkeyCheckResult)}, key is ${data.existkey}.`;
        }
        console.log(colors.gray(summary));
    }
}

module.exports = Logger;
