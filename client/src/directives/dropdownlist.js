import $ from 'jquery';
import accModule from '../acc.module';
import 'kendo-core';
import 'kendo-data';
import 'kendo-list';
import 'kendo-popup';
import 'kendo-dropdownlist';

function dropdownlist($timeout) {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: '<select></select>',
        replace: true,
        link: function (scope, element, attrs, ngModel) {
            $timeout(() => {
                let option = {
                    dataSource: scope[attrs.kDataSource],
                    change(e){
                        let item = e.sender.dataItem(),
                        value = (attrs.kDataValueField && attrs.kDataValueField != '')
                            ? item[attrs.kDataValueField]
                            : item;

                        scope.$apply(() => {
                            ngModel.$setViewValue(value);

                            if (scope[attrs.kOnChanged])
                                scope[attrs.kOnChanged](item);
                        });
                    }
                };

                if (attrs.kOptionLabel && attrs.kOptionLabel != '')
                    option.optionLabel = attrs.kOptionLabel;

                if (attrs.kDataTextField && attrs.kDataTextField != '')
                    option.dataTextField = attrs.kDataTextField;

                if (attrs.kDataValueField && attrs.kDataValueField != '')
                    option.dataValueField = attrs.kDataValueField;

                let dropdown = $(element).kendoDropDownList(option)
                    .data('kendoDropDownList');

                scope.$watch(attrs.ngModel, newValue => dropdown.value(newValue));
            });


        }
    };
}

accModule.directive('devTagDropdownlist', dropdownlist);