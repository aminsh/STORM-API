var enums = require('../constants/enums');

function journalView(entity) {

    var viewModel = {
        id: entity.id,
        temporaryNumber: entity.temporaryNumber,
        temporaryDate: entity.temporaryDate,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        journalStatus: entity.journalStatus,
        journalStatusDisplay: enums.JournalStatus().getDisplay(entity.journalStatus),
        journalType: entity.journalType,
        journalTypeDisplay: entity.journalType
            ? enums.JournalType().getDisplay(entity.journalType)
            : '',
        attachmentFileName: entity.attachmentFileName,
        sumDebtor: entity.journalLines.asEnumerable()
            .sum(function (line) {
                return line.debtor;
            }),
        sumCreditor: entity.journalLines.asEnumerable().sum(function (line) {
            return line.creditor;
        })
    };

    return viewModel;
}

module.exports = journalView;
