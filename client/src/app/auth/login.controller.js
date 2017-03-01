export default class LoginController {
  constructor(api, $http, setDirty) {
    self.vm = this;
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
        // happend
      })
      .catch(function(error) {
        self.vm.isError = true;
      })
  }
}

LoginController.$inject = ['api', '$http', 'setDirty'];
