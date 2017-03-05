export default class LoginController {
  constructor(api, $http, setDirty, $rootScope, $scope, $state) {
    $rootScope.noFooter = true;
    $scope.$on('$destroy', () => {
      $rootScope.noFooter = false;
    })
    self.$rootScope = $rootScope;
    self.vm = this;
    self.$state = $state
    self.api = api;
    self.$http = $http;
    self.setDirty = setDirty;
    self.vm.isError = false;
    self.vm.user = {
      email: '',
      password: ''
    }
  }

  login(form) {
    if (form.$invalid) {
      return self.setDirty(form);
    }
    $http.post(self.api('users.auth.login'), self.vm.user)
      .then(function(data) {
        console.log(data);
        self.$rootScope.$emit("logined", data.data.returnValue)
        self.$state.go("home")
      })
      .catch(function(error) {
        console.log("error: ", error);
        self.vm.isError = true;
      })
  }
}

LoginController.$inject = ['api', '$http', 'setDirty', "$rootScope", "$scope", "$state"];
