import accModule from '../acc.module';
export default class salesListController {
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
                name: 'description', title: translate('description'), type: 'string', width: '30%',
                },
            ],
            readUrl: devConstants.urls.sales.getAll(),
        };

    }
}
