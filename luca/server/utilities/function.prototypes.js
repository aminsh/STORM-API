var getArgs = require('get-parameter-names');

Function.prototype.getArguments = function () {
    return getArgs(this);/*this.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
        .split(/,/);*/
};

