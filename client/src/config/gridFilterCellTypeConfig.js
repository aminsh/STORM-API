import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

accModule.config(function (gridFilterCellTypeProvider) {

    var postingType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.AccountPostingType()
        }),
        modelType: 'string'
    };
    var balanceType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.AccountBalanceType()
        }),
        modelType: 'string'
    };

    var activeType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.Active()
        }),
        modelType: 'boolean'
    }

    let journalType = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.JournalType()
        }),
        modelType: 'number'
    };

    let journalStatus = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.JournalStatus()
        }),
        modelType: 'number'
    }

    let chequeCategoryStatus = {
        cell: gridFilterCellTypeProvider.control.dropdown({
            text: 'display',
            value: 'key',
            data: devConstants.enums.ChequeCategoryStatus()
        }),
        modelType: 'number'
    }

    let generalLedgerAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            url: devConstants.urls.generalLedgerAccount.all()
        }),
        modelType: 'string'
    }

    let subsidiaryLedgerAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            url: devConstants.urls.subsidiaryLedgerAccount.all()
        }),
        modelType: 'string'
    }

    let detailAccount = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'display',
            value: 'id',
            url: devConstants.urls.detailAccount.all()
        }),
        modelType: 'string'
    };

    let bank = {
        cell: gridFilterCellTypeProvider.control.combo({
            text: 'title',
            value: 'id',
            url: devConstants.urls.bank.all()
        }),
        modelType: 'number'

    };

    gridFilterCellTypeProvider.set({
        postingType: postingType,
        balanceType: balanceType,
        activeType: activeType,
        journalType: journalType,
        journalStatus: journalStatus,
        chequeCategoryStatus: chequeCategoryStatus,
        generalLedgerAccount: generalLedgerAccount,
        subsidiaryLedgerAccount: subsidiaryLedgerAccount,
        detailAccount: detailAccount,
        bank: bank
    });
});