"use strict";

let ModelBase = require('../utilities/modelBase'),
    Journal require('./journal');

class Tag extends ModelBase {
    get title() {
        return 'STRING';
    }

    get journals() {
        return [Journal, {
            through: 'journalTags'
        }];
    }
}

module.exports = Tag;
