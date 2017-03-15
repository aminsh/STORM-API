function Enum(enums) {
    this.data = enums;

        this.getDisplay = function (key) {
            return this.data.asEnumerable()
            .single(function (e) {
                return e.key == key;
            }).display;
    }

    this.getKeys = function () {
        return this.data.asEnumerable()
            .select(function (e) {
                return e.key;
    })
            .toArray();
    }
}

module.exports = Enum;