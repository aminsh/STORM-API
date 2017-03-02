import accModule from '../acc.module';
import Collection from 'dev.collection';

function accountReviewTurnoverController($scope, navigate, $routeParams, $location, translate,
                                         dimensionCategoryApi,
                                         accountReviewTurnoverGridOptionService,
                                         showJournalDetailModalService) {
    let titles = {
        generalLedgerAccount: 'Total turnover general ledger account',
        subsidiaryLedgerAccount: 'Total turnover subsidiary ledger account',
        detailAccount: 'Total turnover detail account',
        dimension: 'Total turnover',
        tiny: 'Tiny turnover journals'
    };

    let reportName = $scope.reportName = $routeParams.name;
    let parameters = $location.search();
    let dimensionCategories = [];
    let commands = [
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
        }
    ];

    $scope.commands = [];

    $scope.title = translate(titles[$routeParams.name]);

    if (reportName != 'tiny')
        dimensionCategoryApi.getAllLookup().then((result) => {
            dimensionCategories = result.data;

            $scope.title = $routeParams.name.includes('dimension')
                ? `${translate(titles.dimension)} ${dimensionCategories[parseInt('dimension1'.replace('dimension', '')) - 1].title}`
                : translate(titles[$routeParams.name]);

            $scope.commands = new Collection(dimensionCategories)
                .asEnumerable().select(c => {
                    let order = 3;

                    return {
                        order: ++order,
                        key: `dimension${dimensionCategories.indexOf(c) + 1}`,
                        display: c.title
                    };
                })
                .concat(commands)
                .where(a => a.key != $routeParams.name)
                .orderBy(a => a.order)
                .toArray();
        });

    $scope.titleParameters = getTitleParameters();

    $scope.gridOption = accountReviewTurnoverGridOptionService[$routeParams.name];
    $scope.gridOption.extra = {filter: getParameters()};
    $scope.current = false;

    $scope.execute = (key) => {
        let params = angular.extend({}, parameters);
        delete params[`${key}Id`];
        delete params[`${key}Display`];

        params[`${reportName}Id`] = $scope.current[`${reportName}Id`];
        params[`${reportName}Display`] = `${$scope.current[`${reportName}Code`]} ${$scope.current[`${reportName}Title`]}`;

        navigate('accountReviewTurnover', {name: key}, params);
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
                name: parameters.dimension1Caption,
                value: parameters.dimension1Display
            });

        if (parameters.dimension2Id)
            titleParameters.push({
                name: parameters.dimension2Caption,
                value: parameters.dimension2Display
            });

        if (parameters.dimension3Id)
            titleParameters.push({
                name: parameters.dimension3Caption,
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
            template: '{{item.sumRemainder | number}}',
            aggregates: ['sum'],
            footerTemplate: '{{aggregates.sumRemainder.sum | number}}'
        }
    ];

    options.generalLedgerAccount = {
        columns: [
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '120px'
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
        readUrl: devConstants.urls.accountReview.getAllGeneralLedgerAccount(),
        selectable: true
    };

    options.subsidiaryLedgerAccount = {
        columns: [
            {
                name: 'subsidiaryLedgerAccountCode',
                title: translate('Subsidiary ledger account'),
                type: 'string',
                width: '100px'
            },
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '100px'
            },
            {name: 'subsidiaryLedgerAccountTitle', title: translate('Title'), type: 'string', width: '40%'},
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
        readUrl: devConstants.urls.accountReview.getAllDetailAccount(),
        selectable: true
    };

    options.dimension1 = {
        columns: [
            {
                name: 'dimension1Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[0].title}'),
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
        readUrl: devConstants.urls.accountReview.getAllDimension1(),
        selectable: true
    };

    options.dimension2 = {
        columns: [
            {
                name: 'dimension2Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[1].title}'),
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
        readUrl: devConstants.urls.accountReview.getAllDimension2(),
        selectable: true
    };

    options.dimension3 = {
        columns: [
            {
                name: 'dimension3Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[2].title}'),
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
            {
                name: 'dimension3Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[2].title}'),
                type: 'string',
                width: '70px'
            },
            {
                name: 'dimension2Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[1].title}'),
                type: 'string',
                width: '70px'
            },
            {
                name: 'dimension1Code',
                //headerTemplate: kendo.template('${kendo.dimensionCategories[0].title}'),
                type: 'string',
                width: '70px'
            },
            {
                name: 'detailAccountCode',
                title: translate('Detail account'),
                type: 'string',
                width: '70px'
            },
            {
                name: 'subsidiaryLedgerAccountCode',
                title: translate('Subsidiary ledger account'),
                type: 'string',
                width: '50px'
            },
            {
                name: 'generalLedgerAccountCode',
                title: translate('General ledger account'),
                type: 'string',
                width: '50px'
            },
            {
                name: 'sumDebtor',
                title: translate('Debtor'),
                type: 'number',
                width: '15%',
                format: '{0:#,##}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.sumDebtor.sum | number}}'
            },
            {
                name: 'sumCreditor',
                title: translate('Creditor'),
                type: 'number',
                width: '15%',
                format: '{0:#,##}',
                aggregates: ['sum'],
                footerTemplate: '{{aggregates.sumCreditor.sum | number}}'
            },
            {
                name: 'article', title: translate('Article'), type: 'string', width: '10%',
                template: '<span title="${data.article}">${data.article}</span>'
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

