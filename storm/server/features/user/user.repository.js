"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
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
        return await(knex('users').where('id', id).update(user));
    }

    remove(id){
        return knex('users').where('id', id).del();
    }

    getById(id){
        return knex.table('users').where('id', id).first();
    }

    getByToken(token){
        return knex.table('users').where('token', token).first()
    }

    getUserByEmailAndPassword(email, password){
        return await(knex.table('users')
            .where('email', 'ILIKE', email)
            .where('password', md5(password.toString()))
            .first());
    }

    // [START] SMRSAN
    getUserByEmail(email){

        return knex('users')
            .select("*")
            .where('email', email)
            .first();

    }
    // [-END-] SMRSAN

};