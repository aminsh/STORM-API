import Collection from 'dev.collection';

class Enum {

    constructor(enums) {
        this.data = enums;
    }

    getDisplay(key) {
        return new Collection(this.data)
            .asEnumerable()
            .single(e=>e.key == key)
            .display;
    }

    getKey(name) {
        return new Collection(this.data)
            .asEnumerable()
            .single(e=>e.name == name)
            .key;
    }

    getKeys() {
        let names = Array.from(arguments);

        return new Collection(names)
            .asEnumerable()
            .select(name=> this.getKey(name))
            .toArray();
    }

    get() {
        return this.data;
    }
}

export default Enum;