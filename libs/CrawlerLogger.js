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
        console.log(strResult);
        console.log(`avgFirstByte=${(this.sumData['sum_firstByte'] / count).toFixed(0)}, avgResponseTotal:${(this.sumData['sum_responseTotal'] / count).toFixed(0)}.`);
        console.log('--------------------------');
    }
}

module.exports = Logger;
