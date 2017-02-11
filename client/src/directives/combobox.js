import accModule from '../acc.module';

function combobox() {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<input  style="width: 100%;" />',
        link: function (scope, element, attrs, ngModel) {
            let options = {
                    placeholder: attrs.kPlaceholder,
                    dataTextField: attrs.kDataTextField,
                    dataValueField: attrs.kDataValueField,
                    valuePrimitive: true,
                    filter: "contains",
                    autoBind: false,
                    minLength: 3,
                    dataSource: scope[attrs.kDataSource],
                    select: function (e) {
                        let dataItem = this.dataItem(e.item.index());
                        ngModel.$setViewValue(dataItem[scope.dataValueField]);
                        scope[attrs.kOnChanged](dataItem);

                        scope.$apply();
                    }
                },
                combo = $(element).kendoComboBox(options).data("kendoComboBox");

            scope.$watch(attrs.ngModel, newValue => {
                combo.value(newValue);
            });
        }
    };
}

accModule.directive('devTagComboBox', combobox);
