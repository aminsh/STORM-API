interface AssignPaymentGatewaysToAccount {
    key: string;
    accountId: string;
    accountType: string;
}

interface WoocommerceData {
    consumerKey: string;
    consumerSecret: string;
    url: string;
    paymentMethod: AssignPaymentGatewaysToAccount[],
    canChangeStock: boolean;
    canChangeStockStatusOnZeroQuantity: boolean;
}