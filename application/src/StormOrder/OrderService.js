import {injectable, inject} from "inversify";

const persistedConfig = instanceOf('persistedConfig');

@injectable()
export class StormOrderService {

    @inject("StormOrderRepository")
    /** @type {StormOrderRepository} */ orderRepository = undefined;

    @inject("StormPlanRepository")
    planRepository = undefined;

    @inject("BranchRepository")
    branchRepository = undefined;

    @inject("StormPlanRepository")
    stormPlanRepository = undefined;

    @inject("StormGiftRepository")
    stormGiftRepository = undefined;

    @inject("EventBus")
    /** @{EventBus}*/ eventBus = undefined;

    @inject("HttpRequest")
    /** @type {HttpRequest} */ httpRequest = undefined;


    create(dto) {

        let plan = this.planRepository.findById(dto.planId),
            branch = this.branchRepository.findById(dto.branchId),
            discount = plan.discount.asEnumerable().singleOrDefault(item => item.duration === dto.duration),
            duration = dto.duration;

        if (plan.name === 'Trial') {

            let isUsedTrial = this.orderRepository.isUsedTrialBefore(branch.ownerId);

            if (isUsedTrial)
                throw new ValidationException(['شما قبلا از طرح آزمایشی استفاده کرده اید']);
        }

        if (dto.giftId) {
            let gift = this.stormGiftRepository.findById(dto.giftId);

            if (!gift)
                throw new ValidationException(['کد تخفیف وارد وجود ندارد']);

            let now = Utility.PersianDate.current(),
                isInRange = now >= gift.minDate && now <= gift.maxDate;

            if (!isInRange)
                throw new ValidationException(['کد تخفیف وارد در این تاریخ قابل استفاده نمیباشد']);

            let isUseGift = this.orderRepository.isUsedGift(gift.id, branch.ownerId);

            if (isUseGift)
                throw new ValidationException(['شما قبلا از این کد تخفیف استفاده کرده اید']);

            plan = this.planRepository.findById(gift.planId);

            discount = {rate: gift.discountRate};

            duration = gift.duration;
        }

        let entity = {
            giftId: dto.giftId,
            branchId: dto.branchId,
            number: (this.orderRepository.findMaxNumber() || 10000) + 1,
            issuedDate: new Date(),
            planId: plan.id,
            duration: duration,
            unitPrice: plan.price,
            vat: 0,
            discount: discount ? (plan.price * duration * discount.rate) / 100 : 0
        };

        this.orderRepository.create(entity);

        if ((dto.unitPrice * duration - dto.discount) === 0)
            return this.confirm(entity.id);

        return {id: entity.id};
    }

    confirm(id) {

        let order = this.orderRepository.findById(id),
            isFree = ((order.duration * order.unitPrice) - order.discount) === 0;

        if (isFree) {

            this.eventBus.send("ActivateBranch", id);

            return {noPrice: true, id};
        }

        if (order.invoiceId) {
            let url = this.paymentUrl(order);

            return {invoiceId: order.invoiceId, paymentUrl: url};
        }

        order = this.createInvoice(id);

        let url = this.paymentUrl(order);

        return {invoiceId: order.invoiceId, paymentUrl: url};
    }

    createInvoice(id) {
        let order = this.orderRepository.findById(id);
        let plan = this.stormPlanRepository.findById(order.planId),
            dto = {
                date: Utility.PersianDate.getDate(order.issuedDate),
                customer: {referenceId: order.branchId, title: this.branchRepository.findById(order.branchId).name},
                status: 'confirmed',
                invoiceLines: [
                    {
                        product: {referenceId: plan.id, title: plan.title, productType: 'service'},
                        quantity: order.duration,
                        unitPrice: order.unitPrice,
                        discount: order.discount,
                        vat: 0
                    }
                ]
            },
            originalUrl = process.env.ORIGIN_URL;

        if ((order.unitPrice * order.duration - order.discount) === 0)
            return {noPrice: true};

        let result = this.httpRequest.post(`${originalUrl}/v1/sales`)
            .body(dto)
            .setHeader('x-access-token', persistedConfig.get("STORM_BRANCH_TOKEN").value)
            .execute();

        if (!result.isValid)
            throw new Error('Error on Storm branch ');

        let invoiceId = result.returnValue.id;

        this.orderRepository.update(id, {invoiceId});

        order.invoiceId = invoiceId;

        return order;
    }

    paymentUrl(order) {
        let id = order.id,
            invoiceId = order.invoiceId;

        let originalUrl = process.env.ORIGIN_URL;

        let returnUrl = `${originalUrl}/v1/storm-orders/${id}/payment/callback`,
            url = `${originalUrl}/v1/payment-invoice/${invoiceId}/?branch_id=${persistedConfig.get("STORM_BRANCH_ID").value}&payment_gateway=zarinpal&return_url=${returnUrl}`;

        return url;
    }

    setAsPaid(id) {

        this.orderRepository.update(id, {paidDate: new Date});

        this.eventBus.send("ActivateBranch", id);
    }
}