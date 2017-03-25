var async = require('asyncawait/async');
var await = require('asyncawait/await');

function routeHandler(req , handler) {
    var ioc = req.ioc;

    var deps = handler.getArguments().asEnumerable()
        .select((arg)=> ioc.resolve(arg))
        .toArray();

    handler.apply({}, deps);
}

module .exports = routeHandler;