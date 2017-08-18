var enums = instanceOf('Enums');

function journalView(entity) {

    var viewModel = {
        id: entity.id,
        isInComplete: entity.isInComplete,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        journalStatus: entity.journalStatus,
        journalStatusDisplay: enums.JournalStatus().getDisplay(entity.journalStatus),
        journalType: entity.journalType,
        journalTypeDisplay: entity.journalType
            ? enums.JournalType().getDisplay(entity.journalType)
            : '',
        tagIds: entity.tagIds,
        attachmentFileName: entity.attachmentFileName,
        createdBy: entity.createdBy,
        sumDebtor: entity.sumDebtor,
        sumCreditor: entity.sumCreditor
    };

    return viewModel;
}

module.exports = journalView;
