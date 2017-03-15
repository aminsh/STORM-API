import accModule from '../acc.module';

class menuItemsProvider {

    constructor() {
        this.menuItems = [];
    }

    $get() {
        return this.menuItems;
    }

    add(item) {
        if (!item.url.includes('luca'))
            item.url = `/luca${item.url}`;

        item.children && item.children.forEach(child =>{
            if(!child.url.includes('luca'))
                child.url = `/luca${child.url}`
        });

        this.menuItems.push(item);

        return this;
    }
}

accModule.provider('menuItems', menuItemsProvider);
