import accModule from '../acc.module';
import $ from 'jquery';

function gridFilterCellTypeProvider() {
    var type = {
        string: {
            operator: "contains",
            template: `<input class="form-control" type="text" ng-model="filter.value"/>`
        },
        number: {
            operator: "eq",
            data: [
                {key: 'eq ', display: 'Equal to'},
                {key: 'gte', display: 'Greater than or equal to'},
                {key: 'gt ', display: 'Greater than'},
                {key: 'lte', display: 'Less than or equal to'},
                {key: 'lt ', display: 'Less than'}
            ],
            template: `<li>
                <dev-tag-numeric ng-model="filter.value"></dev-tag-numeric>
            </li>
            <li>
                <div class="btn-group" dropdown >
      <button id="single-button" type="button" class="btn btn-white" 
      dropdown-toggle 
        {{text | translate }}<span class="caret"></span>
      </button>
      <ul class="dropdown-menu" dropdown-menu role="menu" aria-labelledby="single-button">
        <li role="menuitem" ng-repeat="item in items">
            <a href="#" ng-click="function(item){filter.value = item.key;text=item.display;}(item)">
                {{item.display | translate}}
            </a>
        </li>
      </ul>
    </div>
            </li>`
        },
        date: {
            showOperators: false,
            operator: "contains",
            modelType: "string"
        },
        boolean: {}
    };

    function combo(option) {
        return {
            showOperators: false,
            operator: "eq",
            template: function (args) {
                args.element.kendoComboBox({
                    placeholder: '...',
                    dataTextField: option.text,
                    dataValueField: option.value,
                    valuePrimitive: true,
                    filter: "contains",
                    autoBind: false,
                    minLength: 2,
                    dataSource: {
                        type: "json",
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: option.url
                            },
                            parameterMap: function (options) {
                                return kendo.stringify(options);
                            }
                        },
                        schema: {
                            parse: function (response) {
                                return response.data;
                            }
                        }
                    }
                });
            }
        }
    }

    function dropdown(option) {
        return {
            showOperators: false,
            operator: "eq",
            template: function (args) {
                args.element.kendoDropDownList({
                    dataTextField: option.text,
                    dataValueField: option.value,
                    filter: "contains",
                    autoBind: false,
                    minLength: 2,
                    dataSource: option.data,
                    valuePrimitive: true
                });
            }
        };

    }

    this.control = {
        combo: combo,
        dropdown: dropdown
    };

    this.$get = function () {
        return type;
    };

    this.set = function (extendedObject) {
        type = angular.extend(type, extendedObject);
    }
}

accModule.provider('gridFilterCellType', gridFilterCellTypeProvider);

