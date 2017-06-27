"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.detailAccount'),
    personView = require('../viewModel.assemblers/view.person');


module.exports = class DetailAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId);
        }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let detailAccount = await(
            this.knex.select().from('detailAccounts')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());

        if(detailAccount.detailAccountType == 'person')
            return personView(detailAccount);

        return view(detailAccount);
    }

    remove(id){
        return this.knex('detailAccounts').where('id', id).del();
    }
    getAllPeople(parameters){
        return this.getAllByDetailAccountType(parameters, 'person');
    }

    getAllBanks(parameters){
        return this.getAllByDetailAccountType(parameters, 'bank');
    }

    getAllFunds(parameters){
        return this.getAllByDetailAccountType(parameters, 'fund');
    }

    getAllOthers(parameter){
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .whereNull('detailAccountType')
                .as('baseDetailAccounts');
        }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameter, view);
    }

    getAllByDetailAccountType(parameters, type){
        let knex = this.knex,
            branchId = this.branchId,
            views = {personView};

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .andWhere('detailAccountType', type)
                .as('baseDetailAccounts');
        }).as('baseDetailAccounts');


        return kendoQueryResolve(query, parameters, views[`${type}View`]);
    }
};