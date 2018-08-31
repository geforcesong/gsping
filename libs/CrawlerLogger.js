const colors = require('colors/safe');
const GREEN = colors.green;
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
        let self = this;
        this.dataList.push(data);
        let count = this.dataList.length;
        let strResult = '';
        this.fields.forEach((el) => {
            self.sumData['sum_' + el] += data[el];
            strResult += `${el}: ${data[el].toFixed(2)}. `;
        });
        console.log(`${count}. ${strResult}`);
        console.log(colors.gray(`Avg FirstByte: ${GREEN((this.sumData['sum_firstByte'] / count).toFixed(0))}, Avg ResponseTotal: ${GREEN((this.sumData['sum_responseTotal'] / count).toFixed(0))}.`));
    }
}

module.exports = Logger;
