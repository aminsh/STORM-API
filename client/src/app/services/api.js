apiManager.$inject = [];
export default function apiManager() {
  var apis = {
    users: {
      base: '/api/users/',
      auth: {
        login: 'login',
        register: 'register',
      },
      check: {
        email: 'is-unique-email/:email',
      }
    }
  };
  return function(pattern, params = {}) {
    var paths = pattern.split('.');
    var namespace = paths.slice(0, 1);
    var prefix = apis[namespace].base;
    var apiSelected = apis[namespace];
    paths = paths.slice(1);
    paths.forEach((path) => {
      apiSelected = apiSelected[path];
    });
    var url = prefix + apiSelected;
    Object.keys(params).map((param) => {
      const value = params[param];
      const key = `:${param}`;
      url = url.replace(key, value);
      return null;
    });
    console.log(url + ' :url');
    return url;
  }
}
