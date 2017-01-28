(function(){
  'use strict';
  angular.module('app').controller('registerController', registerController);

  registerController.$inject = ["$http", "$api", "setDirty"];
  function registerController($http, $api, setDirty) {
    var vm = this;
    vm.user = {
      name: '',
      email: '',
      password: ''
    }

    activation();

    function activation() {
      vm.register = register;
      vm.checkEmail = checkEmail;
    }

    function checkEmail() {
      var url = $api('users.check.email', {email: vm.user.email});
      $http.get(url)
        .then(function(data) {

        })
        .catch(function(error) {

        })
    }

    function register(form) {
      if (form.$invalid) {
        return setDirty(form);
      }
      $http.post($api('users.auth.register'), vm.user)
        .then(function(data) {
          console.log(data);
        })
        .catch(function(error) {
          console.log(error);
        })
    }
  }
})()
