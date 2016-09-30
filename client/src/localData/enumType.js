class Enum {

    constructor(enums) {
        this.data = enums;
    }

    getDisplay(key) {
        return this.data.asEnumerable()
            .single(e=>e.key == key)
            .display;
    }

    getKey(name) {
        return this.data.asEnumerable()
            .single(e=>e.name == name)
            .key;
    }

    getKeys() {
        let names = Array.from(arguments);

        return names.asEnumerable()
            .select(name=> this.getKey(name))
            .toArray();
    }

    get() {
        return this.data;
    }
}

export default Enum;