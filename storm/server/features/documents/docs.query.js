"use strict";

const knex = instanceOf("knex"),
      async = require("asyncawait/async"),
      await = require("asyncawait/await");

module.exports = class{

    constructor(){

        this.getById = async(this.getById);

    }

    getById(id){

        let page =  await( knex('documentPages').where('id', id).first() );
        page.parentName = "";
        page.hasChild = !!(await( knex('documentPages').where('parentId', page.id).first() ));

        if (page.parentId) {

            let parentPage = await( knex('documentPages')
                                      .select("title")
                                      .where('id', page.parentId)
                                      .first() );
            page.parentName = parentPage.title;

        }

        return page;

    }

    getParentList(){
        return knex('documentPages')
                .select('id', 'title')
                .whereNull('parentId');
    }

};