"use strict";

import accModule from '../acc.module';
import angular from 'angular';

function combo($parse) {
    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: true,
        templateUrl: function (tElement, tAttrs) {
            return '/global/dg-ui/dg-select' + ((angular.isDefined(tAttrs.multiple) ? '-multi' : '') + '.tpl.html');
        },
        compile(tElement, tAttrs){
            let displayPropSufix = tAttrs.kDataTextField ? '.' + tAttrs.kDataTextField : '',
                isMultiple = angular.isDefined(tAttrs.multiple);

            if (tAttrs.onChanged)
                $('ui-select', tElement).attr('on-select', tAttrs.onChanged);

            if(tAttrs.searchEnabled)
                $('ui-select', tElement).attr('search-enabled', tAttrs.searchEnabled);

            if(tAttrs.focusOn)
                $('ui-select', tElement).attr('focus-on', tAttrs.focusOn);

            if (tAttrs.kPlaceholder) {
                $('ui-select-match, *[ui-select-match]', tElement).attr('placeholder', tAttrs.kPlaceholder);
            }

            if (isMultiple) {
                $('ui-select-match, *[ui-select-match]', tElement).html('{{$item' + displayPropSufix + '}}');
            } else {
                $('ui-select-match, *[ui-select-match]', tElement).html('{{$select.selected' + displayPropSufix + '}}');
            }

            let uiSelectChoices = $('ui-select-choices, *[ui-select-choices]', tElement);
            uiSelectChoices.attr('repeat', 'listItem in ' + tAttrs.kDataSource + ' | filter:$select.search');
            uiSelectChoices.html('<div ng-bind-html="listItem' + displayPropSufix + ' | highlight: $select.search"></div>');

            if (angular.isDefined(tAttrs.groupBy)) {
                uiSelectChoices.attr('group-by', `'${tAttrs.groupBy}'`);
            }

            return function link(scope, element, attrs, ctrls) {
                scope.ngModel = ctrls[0];
                scope.disabled = false;

                scope.isMultiple = angular.isDefined(attrs.multiple);
                scope.itemsGetter = $parse(attrs.kDataSource);
                if (angular.isDefined(attrs.kDataValueField) && attrs.kDataValueField !== '') {
                    scope.valuePropGetter = $parse(attrs.kDataValueField);
                }

                scope.$watch(attrs.ngDisabled, newValue => {
                    scope.disabled = newValue;
                });

                scope.getValueMapper = function (itemObject) {
                    return scope.valuePropGetter ? scope.valuePropGetter(itemObject) : itemObject;
                };

                scope.updateValueFromModel = function (modelValue) {
                    if (scope.isMultiple) {
                        var selectionArray = [];
                        angular.forEach(modelValue, function (modelItem, key) {
                            var modelItemValue = scope.getValueMapper(modelItem);
                            selectionArray.push(modelItemValue);
                        });
                        scope.selectionModel = selectionArray;
                    } else {
                        let items = scope.itemsGetter(scope),
                            item = items.asEnumerable().firstOrDefault(item => scope.getValueMapper(item) == modelValue);

                        if (item) {
                            scope.selectionModel = item;

                            if (angular.isDefined(attrs.onBound)) {
                                eval(`scope.${attrs.onBound}`)(item);
                            }

                        }

                        /*angular.forEach(items, function(item, key){
                         var itemValue = scope.getValueMapper(item);
                         if(itemValue == modelValue){
                         scope.selectionModel = item;

                         if(angular.isDefined(attrs.onBound))
                         eval(`scope.${attrs.onBound}`)(item);

                         return false;
                         }
                         });*/
                    }
                };

                if (scope.isMultiple) {
                    scope.$watchCollection(attrs.ngModel, function (modelValue, oldValue) {
                        scope.updateValueFromModel(modelValue);
                    });
                } else {
                    scope.$watch(attrs.ngModel, function (modelValue) {
                        scope.updateValueFromModel(modelValue);
                    });
                }

                //watch the items in case of async loading
                //scope.$watch(attrs.items, function(){
                //	scope.updateValueFromModel(scope.ngModel.$modelValue);
                //});

                scope.onItemSelect = function (item, model) {
                    var modelValue = scope.getValueMapper(item);
                    if (scope.isMultiple) {
                        scope.ngModel.$viewValue.push(modelValue);
                    } else {
                        scope.ngModel.$setViewValue(modelValue);

                        if (angular.isDefined(attrs.onChanged))
                            eval(`scope.${attrs.onChanged}`)(item);
                    }
                };

                scope.onItemRemove = function (item, model) {
                    var removedModelValue = scope.getValueMapper(item);
                    if (scope.isMultiple) {
                        var removeIndex = null;
                        angular.forEach(scope.ngModel.$viewValue, function (itemValue, index) {
                            if (itemValue == removedModelValue) {
                                removeIndex = index;
                                return false;
                            }
                        });
                        if (removeIndex) {
                            scope.ngModel.$viewValue.splice(removeIndex, 1);
                        }
                    } else {
                        scope.ngModel.$setViewValue(removedModelValue);
                    }
                }
            }
        }
    }
}

accModule.directive('devTagUiSelectComboBox', combo)
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('/global/dg-ui/dg-select.tpl.html',
            '<ui-select class="ui-select" ng-model="selectionModel" on-select="onItemSelect($item, $model)" on-remove="onItemRemove($item, $model)" ng-disabled="disabled"><ui-select-match></ui-select-match><ui-select-choices></div></ui-select-choices></ui-select>');
        $templateCache.put('/global/dg-ui/dg-select-multi.tpl.html', '<ui-select class="ui-select" multiple ng-model="selectionModel" on-select="onItemSelect($item, $model)" on-remove="onItemRemove($item, $model)" ng-disabled="disabled"><ui-select-match></ui-select-match><ui-select-choices></ui-select-choices></ui-select>');
    }]);
