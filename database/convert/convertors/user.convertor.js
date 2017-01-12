"use strict";

const Mssql = require('../connection/mssql'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    User = require('../models/user');

class UserConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let users = await(this.sql.query('select * from tblSysUser'));

        data.users = users.asEnumerable()
            .select(t => new User(t))
            .toArray();

        data.users.unshift(new User(this.publicUser));
    }

    get publicUser() {
        return {
            USname: 'کاربر عمومی',
            oldUsername: 'Public',
        }
    }
}

module.exports = UserConvertor;