(function(){
  'use strict';
  angular.module('app').controller('loginController', loginController);

  loginController.$inject = ["$http", "$api", "setDirty"];
  function loginController($http, $api, setDirty) {
    var vm = this;
    vm.user = {
      email: '',
      password: ''
    }

    activation();

    function activation() {
      vm.login = login;
    }

    function login(form) {
      if (form.$invalid) {
        return setDirty(form);
      }
      $http.post($api('users.auth.login'), vm.user)
        .then(function(data) {
          console.log(data);
        })
        .catch(function(error) {
          console.log(error);
        })
    }
  }
})()
