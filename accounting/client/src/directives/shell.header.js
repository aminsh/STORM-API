export default function (fiscalPeriodApi , currentService) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.header-template.html',
        replace: true,
        link: (scope, element, attrs) => {
            scope.fiscalPeriods = [];

            scope.toggleSidebar = () =>  scope.$emit('toggle-sidebar');

            fiscalPeriodApi.getAll()
                .then(result => scope.fiscalPeriods = result.data);

            scope.currentFiscalPeriod = currentService.get().fiscalPeriod;

            scope.selectFiscalPeriod = current => {
                currentService.setFiscalPeriod(current.id);
                scope.currentFiscalPeriod = current.id;
            };
        }
    }
}

