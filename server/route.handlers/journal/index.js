module.exports.getAll = require('./getAll').getAll;
module.exports.getAllByPeriod = require('./getAll').getAllByPeriod;
module.exports.getGroupedByMouth = require('./getAll').getGroupedByMouth;
module.exports.getJournalsByMonth = require('./getAll').getJournalsByMonth;
module.exports.getById = require('./getById');

module.exports.create = require('./create');
module.exports.copy = require('./copy').copy;
module.exports.update = require('./update');
module.exports.remove = require('./remove');
module.exports.bookkeeping = require('./bookkeeping.fix').bookkeeping;
module.exports.fix = require('./bookkeeping.fix').fix;
module.exports.attachImage = require('./attachImage');