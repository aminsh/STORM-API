export default class RegisterController {
  constructor(api, $http, setDirty, $rootScope, $scope, $state) {
    $rootScope.noFooter = true;
    $scope.$on('$destroy', () => {
      $rootScope.noFooter = false;
    })
    self.vm = this;
    self.api = api;
    self.$http = $http;
    self.$state = $state;
    self.setDirty = setDirty;
    self.vm.isError = false;
    self.vm.user = {
      email: '',
      password: ''
    }
  }

  register(form) {
    if (form.$invalid) {
      return self.setDirty(form);
    }
    $http.post(self.api('users.auth.register'), self.vm.user)
      .then(function(data) {
        if(data.isValid===true) {
          $http.post(self.api('users.auth.login'), self.vm.user)
            .then(function(data) {
              self.$state.go("home");
            })
        }
      })
      .catch(function(error) {
        self.vm.isError = true;
        console.log(error);
      })
  }
}

RegisterController.$inject = ['api', '$http', 'setDirty', "$rootScope", "$scope", "$state"];
