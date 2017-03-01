export default class RegisterController {
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
    self.vm.inputs = [
      {
        label: 'نام',
        icon: 'person',
        input: {
          type: 'text',
          name: 'name',
          ngModel: 'registerVM.user.name',
          required: true,
        },
        hint: null,
        alert: {
          getter: 'registerForm.name.$error',
          if: 'registerForm.name.$dirty',
        },
        messages: [
          {
            cause: 'required',
            message: 'وارد کردن نام الزامیست.'
          }
        ]
      },
      {
        label: 'معرف',
        icon: 'person',
        input: {
          type: 'text',
          name: 'inviter',
          ngModel: 'registerVM.user.inviter',
          required: false,
        },
        hint: 'شخصی که ما را به شما معرفی کرده است.',
        messages: []
      },
      {
        label: 'ایمیل',
        icon: 'email',
        input: {
          type: 'email',
          name: 'email',
          ngModel: 'registerVM.user.email',
          required: true,
        },
        hint: null,
        alert: {
          getter: 'registerForm.email.$error',
          if: 'registerForm.email.$dirty',
        },
        messages: [
          {
            cause: 'required',
            message: 'وارد کردن ایمیل الزامیست.'
          },
          {
            cause: 'email',
            message: 'لطفا یک ایمیل مجاز وارد کنید.'
          },
        ]
      },
      {
        label: 'گذرواژه',
        icon: 'lock',
        input: {
          type: 'password',
          name: 'password',
          ngModel: 'registerVM.user.password',
          required: true,
        },
        hint: null,
        alert: {
          getter: 'registerForm.password.$error',
          if: 'registerForm.password.$dirty',
        },
        messages: [
          {
            cause: 'required',
            message: 'وارد کردن گذرواژه الزامیست.'
          },
        ]
      },
      {
        label: 'تکرار گذرواژه',
        icon: 'lock',
        input: {
          type: 'password',
          name: 'confirm_password',
          ngModel: 'registerVM.user.confirm_password',
          required: true,
        },
        hint: null,
        alert: {
          getter: 'registerForm.confirm_password.$error',
          if: 'registerForm.confirm_password.$dirty',
        },
        messages: [
          {
            cause: 'required',
            message: 'وارد کردن گذرواژه الزامیست.'
          },
          {
            cause: 'match',
            message: 'گذرواژه‌ها یکسان نیستند.'
          },
        ]
      },
    ]
  }

  register(form) {
    console.log('hey');
    if (form.$invalid) {
      return self.setDirty(form);
    }
    $http.post(self.api('users.auth.register'), self.vm.user)
      .then(function(data) {
        console.log(data);
      })
      .catch(function(error) {
        self.vm.isError = true;
        console.log(error);
      })
  }
}

RegisterController.$inject = ['api', '$http', 'setDirty'];
