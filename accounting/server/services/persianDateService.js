var moment = require('moment-jalaali');


var persianDateSerive = {
    current: function () {
        return moment().format('jYYYY/jMM/jDD');
    }
};

module.exports = persianDateSerive;
