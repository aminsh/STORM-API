import accModule from '../acc.module';

function NgKendoGrid($compile) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div kendo-grid options="kGridOptions" ng-transclude></div>',
        scope: {
            kOptions: '='
        },
        link: (scope, element, attrs)=> {
            scope.kGridOptions = scope.kOptions;
        },
        compile: (tElem, tAttrs)=> {


            return {
                pre: (scope, element, attrs)=> {


                    let template = $(element).find('.col').html();
                    let result = $compile(template)(scope);
                    scope.kGridOptions = scope.kOptions;

                },
                post: (scope, element, attrs)=> {

                    let grid = $(element).find('div').data("kendoGrid");
                }
            }

        }
    };

}

accModule.directive('devTagNgKendoGrid', NgKendoGrid);
