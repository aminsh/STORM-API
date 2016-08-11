var moment = require('moment-jalaali');


var persianDateSerive = {
    current: function () {
        return moment().format('jYYYY/jM/jD');
    }
};

module.exports = persianDateSerive;
