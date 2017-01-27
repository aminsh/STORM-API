(function(){
  'use strict';
  angular.module('app').factory('$api', apiManager);

  apiManager.$inject = [];
  function apiManager() {
    var apis = {
      users: {
        base: '/api/users/',
        auth: {
          login: 'login',
        }
      }
    };
    return function(pattern) {
      var paths = pattern.split('.');
      var namespace = paths.slice(0, 1);
      var prefix = apis[namespace].base;
      var apiSelected = apis[namespace];
      paths = paths.slice(1);
      paths.forEach((path) => {
        apiSelected = apiSelected[path];
      });
      var url = prefix + apiSelected;
      return url;
    }
  }
})()
