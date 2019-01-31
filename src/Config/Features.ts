export class Features {
    sale: FeaturesAttribute = {
        display: 'فروش',
        routes: ['sales', 'return-sales', 'products', 'product-categories', 'scales', 'price-list']
    };

    purchase: FeaturesAttribute = {
        display: 'خرید',
        routes: ['purchases', 'return-purchases', 'products', 'product-categories', 'scales']
    };

    inventory: FeaturesAttribute = {
        display: 'انبار',
        routes: ['inventories', 'stocks', 'inventory-io-types', 'products', 'product-categories', 'scales', 'inventory-accounting']
    };

    journal: FeaturesAttribute = {
        display: 'دفترداری',
        routes: [
            'journals',
            'account-review',
            'detail-accounts',
            'detail-account-categories',
            'dimensions',
            'dimension-categories',
            'general-ledger-accounts',
            'journal-templates',
            'subsidiary-ledger-accounts',
            'chart-of-accounts',
            'journal-generation-templates',
            'tags'
        ]
    };

    treasury: FeaturesAttribute = {
        display: 'خزانه داری',
        routes: ['treasury', 'banks-name', 'cheque-categories', 'funds', 'banks', 'bank-and-fund']
    };

    other: FeaturesAttribute = {
        routes: ['reports', 'people', 'settings', 'fiscal-periods', 'permissions', 'third-party', 'branches', 'open-card', 'woocommerce', 'payping']
    }
}

interface FeaturesAttribute {
    display?: string;
    routes: string[];
}