"use strict";

function tabs($rootScope) {
    return {
        restrict: 'E',
        scope: {
            tabs: '=data',
            type: '@',
            justified: '@',
            vertical: '@',
            class: '@'
        },
        templateUrl(element, attributes) {
            return attributes.templateUrl || 'partials/templates/tab.default.template.html'
        },
        link(scope, element, attr) {
            let updateTabs = function () {
                scope.update_tabs();
            };

            let unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
            let unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
            let unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
            let unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

            scope.$on('$destroy', unbindStateChangeSuccess);
            scope.$on('$destroy', unbindStateChangeError);
            scope.$on('$destroy', unbindStateChangeCancel);
            scope.$on('$destroy', unbindStateNotFound);
        },
        controller($scope, $state) {
            if (!$scope.tabs) {
                throw new Error('UI Router Tabs: \'data\' attribute not defined, please check documentation for how to use this directive.');
            }

            if (!Array.isArray($scope.tabs)) {
                throw new Error('UI Router Tabs: \'data\' attribute must be an array of tab data with at least one tab defined.');
            }

            let currentStateEqualTo = function (tab) {

                let isEqual = $state.is(tab.route, tab.params, tab.options);
                return isEqual;
            };

            $scope.go = function (tab) {

                if (!currentStateEqualTo(tab) && !tab.disable) {
                    $state.go(tab.route, tab.params, tab.options);
                }
            };

            /* whether to highlight given route as part of the current state */
            $scope.is_active = function (tab) {

                let isAncestorOfCurrentRoute = $state.includes(tab.route, tab.params, tab.options);
                return isAncestorOfCurrentRoute;
            };

            $scope.update_tabs = function () {

                // sets which tab is active (used for highlighting)
                angular.forEach($scope.tabs, function (tab, index) {
                    tab.params = tab.params || {};
                    tab.options = tab.options || {};
                    tab.class = tab.class || '';

                    tab.active = $scope.is_active(tab);
                    if (tab.active) {
                        $scope.tabs.active = index;
                    }
                });
            };

            $scope.update_tabs();
        }
    }
}

export default tabs;