(function(){
  'use strict';
  angular.module('app').factory('setDirty', setDirty);

  setDirty.$inject = [];
  function setDirty() {
    return function(form) {
      angular.forEach(form.$error, function (type) {
        angular.forEach(type, function (field) {
          field.$setDirty();
        });
      });
      return form;
    }
  }
})()
