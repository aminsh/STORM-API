"use strict"

import BaseStore from './store.base';

export default class BankStore extends BaseStore {

    constructor($q) {

    }

    getAll(id) {
        return new RemoteDataSouce({parameters: {
            id: id
        }});
    }

}

class DateSource {

    asKendoDataSource() {

    }

    asPromise() {

    }
}

class OnMemoryDataSouce extends DataSource {

    asKendoDataSource() {

    }

    asPromise() {

    }
}

class RemoteDataSouce extends DataSource {

    asKendoDataSource() {

    }

    asPromise() {

    }
}