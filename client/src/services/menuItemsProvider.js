import accModule from '../acc.module';

class menuItemsProvider {

    constructor() {
        this.menuItems = [];
    }

    $get() {
        return this.menuItems;
    }

    add(item) {
        this.menuItems.push(item);

        return this;
    }
}

accModule.provider('menuItems', menuItemsProvider);
