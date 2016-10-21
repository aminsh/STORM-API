import accModule from '../acc.module';

function accountReviewTurnoverController($scope, navigate, $routeParams, $location,
                                         accountReviewTurnoverGridOptionService) {
    let titles = {
        generalLedgerAccount: 'Total turnover general ledger account',
        subsidiaryLedgerAccount: 'Total turnover subsidiary ledger account',
        detailAccount: 'Total turnover detail account',
    };
    $scope.title = titles[$routeParams.name];
    $scope.gridOption = accountReviewTurnoverGridOptionService[$routeParams.name];
    $scope.gridOption.extra = {filter: $location.search()};

}


function accountReviewTurnoverGridOptionService(translate, constants) {
    let options = {};

    let amountColumns = [
        {
            name: 'sumBeforeRemainder',
            title: translate('Before remainder'),
            type: 'number',
            width: '15%',
            format: '{0:#,##}',
            aggregates: ['sum'],
            footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
        },
        {
            name: 'sumDebtor',
            title: translate('Debtor'),
            type: 'number',
            width: '15%',
            format: '{0:#,##}',
            aggregates: ['sum'],
            footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
        },
        {
            name: 'sumCreditor',
            title: translate('Creditor'),
            type: 'number',
            width: '15%',
            format: '{0:#,##}',
            aggregates: ['sum'],
            footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
        },
        {
            name: 'sumRemainder',
            title: translate('Remainder'),
            type: 'number',
            width: '15%',
            format: '{0:#,##}',
            aggregates: ['sum'],
            footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
        }
    ];

    options.generalLedgerAccount = {
        columns: [
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'generalLedgerAccountTitle',
                title: translate('Title'),
                type: 'string',
                width: '40%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllGeneralLedgerAccount()
    };

    options.subsidiaryLedgerAccount = {
        columns: [
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'subsidiaryLedgerAccountCode',
                title: translate('Subsidiary ledger account'),
                type: 'string',
                width: '100px'
            },
            {name: 'subsidiaryLedgerAccountTitle', title: translate('Title'), type: 'string', width: '40%'},
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllSubsidiaryLedgerAccount()
    };

    options.detailAccount = {
        columns: [
            {
                name: 'detailAccountCode',
                title: translate('Detail account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'detailAccountTitle',
                title: translate('Title'),
                type: 'string',
                width: '40%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllDetailAccount()
    };

    options.dimension1 = {
        columns: [
            {
                name: 'dimension1Code',
                title: translate('Detail account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'dimension1Title',
                title: translate('Title'),
                type: 'string',
                width: '40%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllDimension1()
    };

    options.dimension2 = {
        columns: [
            {
                name: 'dimension2Code',
                title: translate('Detail account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'dimension2Title',
                title: translate('Title'),
                type: 'string',
                width: '40%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllDimension2()
    };

    options.dimension3 = {
        columns: [
            {
                name: 'dimension3Code',
                title: translate('Detail account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'dimension3Title',
                title: translate('Title'),
                type: 'string',
                width: '40%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: constants.urls.accountReview.getAllDimension3()
    };

    return options;
}

accModule
    .controller('accountReviewTurnoverController', accountReviewTurnoverController)
    .factory('accountReviewTurnoverGridOptionService', accountReviewTurnoverGridOptionService);

