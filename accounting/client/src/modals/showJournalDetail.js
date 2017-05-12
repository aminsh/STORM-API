import accModule from '../acc.module';

function showJournalDetailController($scope, translate, $uibModalInstance, journalApi, journalLineApi, data) {
    "use strict";

    let id = data.id;
    $scope.journal = {};

    function fetch() {
        journalApi.getById(id)
            .then((result)=> $scope.journal = result);
    }

    fetch();

    $scope.gridOption = {
        columns: [
            {name: 'row', title: '#', width: '60px', type: 'number', filterable: false, sortable: false},
            {
                name: 'generalLedgerAccountId',
                title: translate('General ledger account'),
                type: 'generalLedgerAccount',
                template: '<span title="{{item.generalLedgerAccountDisplay}}">{{item.generalLedgerAccountCode}}</span>',
                width: '100px'
            },
            {
                name: 'subsidiaryLedgerAccountId',
                title: translate('Subsidiary ledger account'),
                type: 'subsidiaryLedgerAccount',
                template: '<span title="{{item.subsidiaryLedgerAccountDisplay}}">{{item.subsidiaryLedgerAccountCode}}</span>',
                width: '100px'
            },
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '<span title="{{item.detailAccountDisplay}}">{{item.detailAccountCode}}</span>',
                width: '120px'
            },
            {
                name: 'article', title: translate('Article'), width: '200px', type: 'string',
                template: '<span title="{{item.article}}">{{item.article}}</span>'
            },
            {
                name: 'debtor', title: translate('Debtor'), width: '120px', type: 'number', template: '{{item.debtor|number}}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.debtor.sum | number}}'
            },
            {
                name: 'creditor', title: translate('Creditor'), width: '120px', type: 'number', template: '{{item.creditor|number}}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.creditor.sum | number}}'
            }
        ],
        commands: [],
        gridSize: '300px',
        readUrl: journalLineApi.url.getAll(id)
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
}

function showJournalDetailModalService(modalBase) {
    return modalBase({
        controller: showJournalDetailController,
        templateUrl: 'partials/modals/showJournalDetail.html',
        size: 'lg'
    });
}

accModule
    .controller('showJournalDetailController', showJournalDetailController)
    .factory('showJournalDetailModalService', showJournalDetailModalService);

