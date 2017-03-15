"use strict";

const Base = require('./base');

class Dimension extends Base {
    constructor(model, category) {

        if (!category)
            return new Error('categoryIndex is undefined');

        super();

        const sourceNameColumn = this.sourceNameColumns[category.index];

        this.code = model[sourceNameColumn.code];
        this.title = model[sourceNameColumn.title];
        this.dimensionCategoryId = category.id;
        this.isActive = true;

    }

    get sourceNameColumns() {
        return [
            { name: 'CostCenter', code: 'Code4', title: 'Title' },
            { name: 'tblCode5', code: 'ID', title: 'Des' },
            { name: 'tblCode6', code: 'ID', title: 'Des' }
        ];
    }
}

module.exports = Dimension;
