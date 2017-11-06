import accModule from '../acc.module';

function accountReviewTurnoverController($scope,
                                         $state,
                                         navigate,
                                         $stateParams,
                                         $location,
                                         translate,
                                         accountReviewTurnoverGridOptionService,
                                         showJournalDetailModalService) {
    let titles = {
        generalLedgerAccount: translate('Total turnover general ledger account'),
        subsidiaryLedgerAccount: translate('Total turnover subsidiary ledger account'),
        detailAccount: translate('Total turnover detail account'),
        dimension1: `${translate('Total turnover dimension')} ${translate('Dimension1')}`,
        dimension2: `${translate('Total turnover dimension')} ${translate('Dimension2')}`,
        dimension3: `${translate('Total turnover dimension')} ${translate('Dimension2')}`,
        tiny: translate('Tiny turnover journals')
    };

    let reportName = $scope.reportName = $stateParams.name,
        printData = {
            generalLedgerAccount: 1000,
            subsidiaryLedgerAccount: 1001,
            detailAccount: 1002,
            tiny: 1003
        };
    let parameters = $location.search();

    $scope.commands = [
        {
            order: 0,
            key: 'tiny',
            display: translate('Tiny turnover journals')
        },
        {
            order: 1,
            key: 'generalLedgerAccount',
            display: translate('General ledger account')
        },
        {
            order: 2,
            key: 'subsidiaryLedgerAccount',
            display: translate('Subsidiary ledger account')
        },
        {
            order: 3,
            key: 'detailAccount',
            display: translate('Detail account')
        },
        /*{
            order: 4,
            key: 'dimension1',
            display: translate('Dimension1')
        },
        {
            order: 5,
            key: 'dimension2',
            display: translate('Dimension2')
        }*/
    ]
        .asEnumerable()
        .where(c => c.key != reportName)
        .toArray();

    $scope.title = titles[$stateParams.name];

    $scope.titleParameters = getTitleParameters();

    $scope.gridOption = accountReviewTurnoverGridOptionService[$stateParams.name];
    $scope.gridOption.extra = {filter: getParameters()};
    $scope.current = false;

    $scope.execute = (key) => {
        let params = angular.extend({}, parameters);
        delete params[`${key}Id`];
        delete params[`${key}Display`];

        params[`${reportName}Id`] = $scope.current[`${reportName}Id`];
        params[`${reportName}Display`] = `${$scope.current[`${reportName}Code`]} ${$scope.current[`${reportName}Title`]}`;

        navigate('account-review-turnover', {name: key}, params);
    };

    $scope.onCurrentChanged = (current) => {
        if (!current) $scope.current = false;

        $scope.current = current;
    };

    $scope.showJournal = () => {
        showJournalDetailModalService
            .show({
                id: $scope.current.id
            });
    };

    $scope.print = ()=> {

        navigate(
            'report.print',
            {key: printData[reportName]},
            getParameters());
    };

    function getTitleParameters() {
        let titleParameters = [];

        if (parameters.generalLedgerAccountId)
            titleParameters.push({
                name: translate('General ledger account'),
                value: parameters.generalLedgerAccountDisplay
            });

        if (parameters.subsidiaryLedgerAccountId)
            titleParameters.push({
                name: translate('Subsidiary ledger account'),
                value: parameters.subsidiaryLedgerAccountDisplay
            });

        if (parameters.detailAccountId)
            titleParameters.push({
                name: translate('Detail account'),
                value: parameters.detailAccountDisplay
            });

        if (parameters.dimension1Id)
            titleParameters.push({
                name: translate('Dimension1'),
                value: parameters.dimension1Display
            });

        if (parameters.dimension2Id)
            titleParameters.push({
                name: translate('Dimension2'),
                value: parameters.dimension2Display
            });

        if (parameters.dimension3Id)
            titleParameters.push({
                name: translate('Dimension3'),
                value: parameters.dimension3Display
            });

        if (parameters.minNumber)
            titleParameters.push({
                name: translate('Number'),
                value: `[${parameters.minNumber},${parameters.maxNumber}]`
            });

        if (parameters.minDate)
            titleParameters.push({
                name: translate('Date'),
                value: `[${parameters.minDate},${parameters.maxDate}]`
            });

        if (eval(parameters.notShowZeroRemainder))
            titleParameters.push({
                name: translate('Not show zero remiander')
            });

        if (eval(parameters.isNotPeriodIncluded))
            titleParameters.push({
                name: translate('Is not period included')
            });

        return titleParameters;
    }

    function getParameters() {
        let params = {};

        if (parameters.generalLedgerAccountId)
            params.generalLedgerAccountId = parameters.generalLedgerAccountId;

        if (parameters.subsidiaryLedgerAccountId)
            params.subsidiaryLedgerAccountId = parameters.subsidiaryLedgerAccountId;

        if (parameters.detailAccountId)
            params.detailAccountId = parameters.detailAccountId;

        if (parameters.dimension1Id)
            params.dimension1Id = parameters.dimension1Id;

        if (parameters.dimension2Id)
            params.dimension2Id = parameters.dimension2Id;

        if (parameters.dimension3Id)
            params.dimension3Id = parameters.dimension3Id;

        if (parameters.minNumber) {
            params.minNumber = parameters.minNumber;
            params.maxNumber = parameters.maxNumber;
        }

        if (parameters.minDate) {
            params.minDate = parameters.minDate;
            params.maxDate = parameters.maxDate;
        }

        params.notShowZeroRemainder = parameters.notShowZeroRemainder;
        params.isNotPeriodInclude = parameters.isNotPeriodInclude;

        return params;
    }


}


function accountReviewTurnoverGridOptionService(translate, devConstants) {
    let options = {};

    let amountColumns = [
        {
            name: 'sumBeforeRemainder',
            title: translate('Before remainder'),
            type: 'number',
            width: '15%',
            template: '{{item.sumBeforeRemainder | number}}',
            aggregates: ['sum'],
            footerTemplate: '{{aggregates.sumBeforeRemainder.sum | number}}'
        },
        {
            name: 'sumDebtor',
            title: translate('Debtor'),
            type: 'number',
            width: '15%',
            template: '{{item.sumDebtor | number}}',
            aggregates: ['sum'],
            footerTemplate: '{{aggregates.sumDebtor.sum | number}}'
        },
        {
            name: 'sumCreditor',
            title: translate('Creditor'),
            type: 'number',
            width: '15%',
            template: '{{item.sumCreditor | number}}',
            aggregates: ['sum'],
            footerTemplate: '{{aggregates.sumCreditor.sum | number}}'
        },
        {
            name: 'sumRemainder',
            title: translate('Remainder'),
            type: 'number',
            width: '15%',
            template: `<span 
class="text-success" 
ng-if="item.sumRemainder >= 0"
style="font-weight: bold">{{item.sumRemainder | number}}</span>
            <span 
            class="text-danger" 
            ng-if="item.sumRemainder < 0"
            style="font-weight: bold">({{item.sumRemainder*-1 | number}})</span>`,
            aggregates: ['sum'],
            footerTemplate: `<span 
class="text-success" 
ng-if="aggregates.sumRemainder.sum >= 0"
style="font-weight: bold">{{aggregates.sumRemainder.sum | number}}</span>
            <span 
            class="text-danger" 
            ng-if="aggregates.sumRemainder.sum < 0"
            style="font-weight: bold">({{aggregates.sumRemainder.sum*-1 | number}})</span>`
        }
    ];

    options.generalLedgerAccount = {
        columns: [
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '10%'
            },
            {
                name: 'generalLedgerAccountTitle',
                title: translate('Title'),
                type: 'string',
                width: '30%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllGeneralLedgerAccount(),
        selectable: true
    };

    options.subsidiaryLedgerAccount = {
        columns: [
            {
                name: 'subsidiaryLedgerAccountCode',
                title: translate('Subsidiary ledger account'),
                type: 'string',
                width: '7%'
            },
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '7%'
            },
            {name: 'subsidiaryLedgerAccountTitle', title: translate('Title'), type: 'string', width: '28%'},
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllSubsidiaryLedgerAccount(),
        selectable: true
    };

    options.detailAccount = {
        columns: [
            {
                name: 'detailAccountCode',
                title: translate('Detail account'),
                type: 'string',
                width: '10%'
            },
            {
                name: 'detailAccountTitle',
                title: translate('Title'),
                type: 'string',
                width: '30%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllDetailAccount(),
        selectable: true
    };

    options.dimension1 = {
        columns: [
            {
                name: 'dimension1Code',
                title: translate('Dimension1'),
                type: 'string',
                width: '10%'
            },
            {
                name: 'dimension1Title',
                title: translate('Title'),
                type: 'string',
                width: '30%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllDimension1(),
        selectable: true
    };

    options.dimension2 = {
        columns: [
            {
                name: 'dimension2Code',
                title: translate('Dimension2'),
                type: 'string',
                width: '10%'
            },
            {
                name: 'dimension2Title',
                title: translate('Title'),
                type: 'string',
                width: '30%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllDimension2(),
        selectable: true
    };

    options.dimension3 = {
        columns: [
            {
                name: 'dimension3Code',
                title: translate('Dimension3'),
                type: 'string',
                width: '10%'
            },
            {
                name: 'dimension3Title',
                title: translate('Title'),
                type: 'string',
                width: '30%'
            },
            ...amountColumns
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllDimension3(),
        selectable: true
    };

    options.tiny = {
        columns: [
            {
                name: 'number',
                title: translate('Number'),
                type: 'number',
                width: '50px'
            },
            {
                name: 'date',
                title: translate('Date'),
                type: 'string',
                width: '100px'
            },
            /*{
                name: 'dimension2Code',
                title: translate('Dimension2'),
                type: 'string',
                width: '70px'
            },
            {
                name: 'dimension1Code',
                title: translate('Dimension1'),
                type: 'string',
                width: '70px'
            },*/
            {
                name: 'detailAccountCode',
                title: translate('Detail account'),
                type: 'string',
                width: '70px',
                template: '<span title="{{item.detailAccountTitle}}">{{item.detailAccountCode ? item.detailAccountCode : item.detailAccountTitle}}</span>'
            },
            {
                name: 'subsidiaryLedgerAccountCode',
                title: translate('Subsidiary ledger account'),
                type: 'string',
                width: '50px',
                template: '<span title="{{item.subsidiaryLedgerAccountTitle}}">{{item.subsidiaryLedgerAccountCode}}</span>'
            },
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '50px',
                template: '<span title="{{item.generalLedgerAccountTitle}}">{{item.generalLedgerAccountCode}}</span>'
            },
            {
                name: 'sumDebtor',
                title: translate('Debtor'),
                type: 'number',
                width: '15%',
                template: '{{item.sumDebtor|number}}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.sumDebtor.sum | number}}'
            },
            {
                name: 'sumCreditor',
                title: translate('Creditor'),
                type: 'number',
                width: '15%',
                template: '{{item.sumCreditor|number}}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.sumCreditor.sum | number}}'
            },
            {
                name: 'article', title: translate('Article'), type: 'string', width: '10%',
                template: '<span title="{{item.article}}">{{item.article}}</span>'
            },
        ],
        commands: [],
        readUrl: devConstants.urls.accountReview.getAllTiny(),
        selectable: true
    };

    return options;
}

accModule
    .controller('accountReviewTurnoverController', accountReviewTurnoverController)
    .factory('accountReviewTurnoverGridOptionService', accountReviewTurnoverGridOptionService);

