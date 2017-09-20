"use strict";

const knex = instanceOf('knex'),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    Guid = instanceOf('utility').Guid;

module.exports = class{

    constructor(){

        this.save = async(this.save);
        this.update = async(this.update);

    }

    save(data) {

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
                    parentId: data.groupId || null
                })
            );
        return true;

    }

    update(id, data) {

        let groupRecord = null;

        let similarTitle = await( knex('documentPages').where('title', data.title).first() );

        // Check if there is a similar title
        if (!!(similarTitle) && similarTitle.id !== id)
            return false;

        // Check if the groupName is correct
        if (data.groupId && data.groupId !== id) {

            groupRecord = await(knex('documentPages').where('id', data.groupId).first());
            // Is Exists ? or Could It Be Parent ?
            if (!(groupRecord) || groupRecord.parentId)
                data.groupId = null;

        } else { data.groupId = null; }

        await(
            knex('documentPages')
                .update({
                    title: data.title,
                    pageContent: data.content,
                    parentId: data.groupId
                })
                .where("id", id)
        );
        return true;

    }

    delete(id) {

        return knex('documentPages')
                .where('id', id)
                .del();

    }

    getList() {

        return knex('documentPages')
            .select('id', 'title', 'parentId')
            .orderBy('title', 'asc');

    }

    deleteParent(pageId) {

        return knex('documentPages')
            .update({
                parentId: null
            })
            .where('id', pageId);

    }

};