import $ from 'jquery';
import accModule from '../acc.module';

function dropdownlist() {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: '<select></select>',
        replace: true,
        link: function (scope, element, attrs, ngModel) {
            let dropdown = $(element).kendoDropDownList({
                optionLabel: attrs.kOptionLabel,
                dataTextField: attrs.kDataTextField,
                dataValueField: attrs.kDataValueField,
                dataSource: scope[attrs.kDataSource],
                change: (e)=> {
                    let item = e.sender.dataItem();

                    scope.$apply(()=> {
                        ngModel.$setViewValue(item[attrs.kDataValueField]);

                        if (scope[attrs.kOnChanged])
                            scope[attrs.kOnChanged](item);
                    });
                }
            }).data('kendoDropDownList');

            scope.$watch(attrs.ngModel, newValue => dropdown.value(newValue));
        }
    };
}

accModule.directive('devTagDropdownlist', dropdownlist);