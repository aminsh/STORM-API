var enums = require('../constants/enums');

function journalView(entity) {

    var viewModel = {
        temporaryNumber: entity.temporaryNumber,
        temporaryDate: entity.temporaryDate,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        journalStatus: entity.journalStatus,
        journalStatusDisplay: enums.JournalStatus().getDisplay(entity.journalStatus),
        journalType: entity.journalType,
        journalTypeDisplay: enums.JournalType().getDisplay(entity.journalType),
        attachmentFileName: entity.attachmentFileName
    };

    return viewModel;
}

module.exports = journalView;
