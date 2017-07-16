"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = require('../../services/shared').utility.Guid,
    md5 = require('md5');


module.exports = class {
    constructor(){
        this.create = async(this.create);
    }

    create(user){
        if(!user.id)
            user.id = Guid.new();

        return knex('users').insert(user);
    }

    update(id, user){
        return knex('users').where('id', id).update(user);
    }

    getById(id){
        return knex.table('users'). where('id', id).first();
    }

    getByToken(token){
        return knex.table('users').where('token', token).first()
    }

    getUserByEmailAndPassword(email, password){
        return knex.table('users')
            .where('email', 'ILIKE', email)
            .andWhere('password', md5(password.toString()))
            .first();
    }

    // SMRSAN
    getUserByEmail(email){

        return knex.table('users')
            .where('email', email)
            .first();

    }

};