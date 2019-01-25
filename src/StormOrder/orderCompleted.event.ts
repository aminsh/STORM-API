export class OrderCompletedEvent {
    constructor(orderId: string) {
        this.orderId = orderId;
    }

    readonly orderId: string;
}