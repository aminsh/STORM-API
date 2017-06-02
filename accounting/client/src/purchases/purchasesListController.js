import accModule from '../acc.module';
export default class purchasesListController {
    constructor(
                translate,
                devConstants,
                logger,
                $timeout,
                $scope,) {

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;

        $scope.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), width: '120px', type: 'number'},
                {name: 'date', title: translate('Date'), type: 'date', width: '120px',},
                {
                name: 'description', title: translate('Description'), type: 'string', width: '30%',
                },
            ],
            readUrl: devConstants.urls.purchase.getAll(),
        };

    }
}
