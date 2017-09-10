"use strict";

const knex = instanceOf('knex'),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    Guid = instanceOf('utility').Guid;

module.exports = class{

    constructor(){
    }

    save(data){

        let groupRecord = null;
        if(!data.id)
            data.id = Guid.new();

        // Check if there is a similar title
        if (!!(await( knex('documentPages').where('title', data.title).first() )))
            return false;

        // Check if the groupName is correct
        if (data.groupId) {
            groupRecord = await(knex('documentPages').where('id', data.groupId).first());
            // Is Exists ?
            if (!(groupRecord))
                return false;
            // Could It Be Parent ?
            if (groupRecord.parentId)
                return false;
        }

        await(
            knex('documentPages')
                .insert({
                    id: data.id,
                    title: data.title,
                    pageContent: data.content,
                    parentId: data.groupId || undefined
                })
            );
        return true;

    }

    getList() {

        return knex('documentPages')
            .select('id', 'title', 'parentId');

    }

};