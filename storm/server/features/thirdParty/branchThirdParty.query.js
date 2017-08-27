"use strct";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Enums = instanceOf('Enums'),
    allThirdParties = Enums.ThirdParty().data;

module.exports = class BranchThirdPartyQuery {

    constructor(){

        this.getSelected = async(this.getSelected);

    }

    getSelected(branchId){

        let allSelectedThirdParties =  await(knex.from('branchThirdParty')
                                        .where('branchId', branchId));

        return allThirdParties
            .asEnumerable()
            .groupJoin(
                allSelectedThirdParties,
                all => all.key,
                selected => selected.key,
                (all, items) => ({
                    key: all.key,
                    display: all.data.display,
                    title: all.data.title,
                    logo: all.data.logo,
                    description: all.data.description,
                    isActivated: items.any()
                })
            )
            .toArray();

    }

};