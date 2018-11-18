import {injectable, inject} from "inversify";

@injectable()
export class StormOrderService {

    @inject("PersistedConfigService")
    /**@type{PersistedConfigService}*/ persistedConfigService = undefined;

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

            duration = plan.discount[0].duration;

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

            if (!gift.plans.includes(plan.id))
                throw new ValidationException(['کد تخفیف برای طرح انتخاب شده نیست']);

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
                status: 'draft',
                invoiceLines: [
                    {
                        product: {referenceId: plan.id, title: plan.title, productType: 'service'},
                        quantity: order.duration,
                        unitPrice: order.unitPrice,
                        discount: order.discount,
                        vat: 0, tax: 0
                    }
                ]
            };

        if ((order.unitPrice * order.duration - order.discount) === 0)
            return {noPrice: true};

        try {

            const result = this.httpRequest.post(`${process.env.DELIVERY_URL}/api`)
                .query({url: '/v1/sales', method: 'POST'})
                .body(dto)
                .setHeader('x-access-token', this.persistedConfigService.get("STORM_BRANCH_TOKEN").value)
                .execute();

            const invoiceId = result.id;

            this.orderRepository.update(id, {invoiceId});

            order.invoiceId = invoiceId;

            return order;
        }
        catch (e) {

            throw new Error('Error on Storm branch ');
        }
    }


    paymentUrl(order) {
        let id = order.id,
            invoiceId = order.invoiceId;

        let originalUrl = process.env.ORIGIN_URL;

        let returnUrl = `${originalUrl}/v1/storm-orders/${id}/payment/callback`,
            url = `${originalUrl}/v1/payment-invoice/${invoiceId}/?branchId=${this.persistedConfigService.get("STORM_BRANCH_ID").value}&payment_gateway=zarinpal&return_url=${returnUrl}`;

        return url;
    }

    setAsPaid(id) {

        this.orderRepository.update(id, {paidDate: new Date});

        this.eventBus.send("ActivateBranch", id);

        const order = this.orderRepository.findById(id);

        try {

            const result = this.httpRequest.post(`${process.env.DELIVERY_URL}/api`)
                .query({url: `/v1/sales/${order.invoiceId}/confirm`, method: 'POST'})
                .setHeader('x-access-token', this.persistedConfigService.get("STORM_BRANCH_TOKEN").value)
                .execute();

            console.log(result);

        } catch (e) {
            console.log('Error on set status confirm');

            console.log(e);
        }
    }
}