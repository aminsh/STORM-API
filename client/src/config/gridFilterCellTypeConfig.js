import accModule from '../acc.module';
import constants from '../localData/constants';

accModule.config(function (gridFilterCellTypeProvider) {

    var postingType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: constants.enums.AccountPostingType()
        }),
        modelType: 'string'
    };
    var balanceType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: constants.enums.AccountBalanceType()
        }),
        modelType: 'string'
    };

    var activeType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: constants.enums.Active()
        }),
        modelType: 'boolean'
    }

    let journalType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: constants.enums.JournalType()
        }),
        modelType: 'number'
    };

    let journalStatus = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: constants.enums.JournalStatus()
        }),
        modelType: 'number'
    }

    let generalLedgerAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            url: constants.urls.generalLedgerAccount.all()
        }),
        modelType: 'string'
    }

    let subsidiaryLedgerAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            url: constants.urls.subsidiaryLedgerAccount.all()
        }),
        modelType: 'string'
    }

    let detailAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            utl: constants.urls.detailAccount.all()
        }),
        modelType: 'string'
    }

    gridFilterCellTypeProvider.set({
        postingType: postingType,
        balanceType: balanceType,
        activeType: activeType,
        journalType: journalType,
        journalStatus: journalStatus,
        generalLedgerAccount: generalLedgerAccount,
        subsidiaryLedgerAccount: subsidiaryLedgerAccount,
        detailAccount: detailAccount
    });
});