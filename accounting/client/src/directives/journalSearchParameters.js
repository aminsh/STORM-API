import accModule from '../acc.module';

function journalSearchParameters(dimensionCategoryApi) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/journal-search-parameters.html',
        scope: {
            searchParameters: '=',
            removeParameters: '&'
        },
        link: function (scope, element, attrs) {
            scope.dimensionCategorie = [];

            dimensionCategoryApi.getAllLookup()
                .then((result)=> scope.dimensionCategories = result.data);

            scope.remove = (e)=> {
                e.preventDefault();
                scope.removeParameters();
            }
        }
    }
}

accModule.directive('devTagJournalSearchParameters', journalSearchParameters);