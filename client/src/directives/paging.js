
export default function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/paging-template.html',
        replace: true,
        scope: {
            'setPage': '&devAttrSetPage',
            'total': '=devAttrTotal',
            'option': '=devAttrOption'
        },
        link: (scope, element, attrs) => {
            scope.currentPage = 1;
            scope.pageSizes = [10, 20, 50, 100];
            scope.pageSize = 20;

            scope.change = () => {
                let page = {
                    skip: (scope.currentPage - 1 ) * scope.pageSize,
                    take: scope.pageSize
                };
                scope.setPage({page});
            };

            scope.option.reset = () => {
                scope.currentPage = 1;
                scope.change();
            };

            scope.$watch('pageSize', ()=> scope.option.reset());

            scope.change();
        }
    }
}
