var async = require('asyncawait/async');
var await = require('asyncawait/await');

function ioc(req, res) {
    var self = this;

    self.container = {};

    self.register = (key, factory) => self.container[key] = factory;

    self.resolve = async.result(key => {
        var item = self.container[key];

        if (typeof item == 'function') {
            var args = item.getArguments();
            if (args.length == 0)
                return new item();
            else {
                var deps = args.asEnumerable()
                    .select(a => self.resolve(a)).toArray();

                return (item.prototype)
                    ? new (Function.prototype.bind.apply(item, [null].concat(deps)))
                    : item.apply({}, deps);
            }
        }


        return item;
    });
}

module.exports = ioc;

