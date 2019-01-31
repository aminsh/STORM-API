import { Injectable } from "../Infrastructure/DependencyInjection";
import { OrderCreateDTO } from "./order.DTO";
import { PlanRepository } from "./plan.repository";
import { BranchRepository } from "../Branch/branch.repository";
import { GiftRepository } from "./gift.repository";
import { OrderRepository } from "./order.repository";
import { Enumerable, HttpMethod, HttpRequest, PersianDate } from "../Infrastructure/Utility";
import { PlanCategory } from "./plan.entity";
import { BadRequestException, NotFoundException } from "../Infrastructure/Exceptions";
import { Order } from "./order.entity";
import { Configuration } from "../Config/Configuration";
import * as qs from 'qs';
import { EventPublisher } from "../Infrastructure/EventHandler";
import { OrderCompletedEvent } from "./orderCompleted.event";

@Injectable()
export class OrderService {
    constructor(private readonly planRepository: PlanRepository,
                private readonly branchRepository: BranchRepository,
                private readonly giftRepository: GiftRepository,
                private readonly orderRepository: OrderRepository,
                private readonly eventPublisher: EventPublisher,
                private readonly config: Configuration) { }

    async create(dto: OrderCreateDTO): Promise<any> {
        let plan = await this.planRepository.findOne({ id: dto.planId }),
            branch = await this.branchRepository.findById(dto.branchId),
            gift = dto.giftId ? await this.giftRepository.findOne({ id: dto.giftId }) : undefined,
            discount = Enumerable.from(plan.discount).singleOrDefault(d => d.duration === dto.duraion),
            duration = dto.duration;

        if (plan.category === PlanCategory.TRIAL) {
            duration = plan.discount[ 0 ].duration;

            const isUsedTrial = await this.orderRepository.isUsedTrial(branch.owner);

            if (isUsedTrial)
                throw new BadRequestException([ 'شما قبلا از طرح آزمایشی استفاده کرده اید' ]);
        }

        if (gift) {
            if (!gift.isActive)
                throw new BadRequestException([ 'کد تخفیف وارد شده وجود ندارد' ]);

            const now = PersianDate.current(),
                isInRange = now >= gift.minDate && now <= gift.maxDate;

            if (!isInRange && !gift.unlimited)
                throw new BadRequestException([ 'کد تخفیف وارد شده در این تاریخ قابل استفاده نمیباشد' ]);

            if (!gift.usable) {
                const isUsedGift = await this.orderRepository.findOne({
                    branch: { id: branch.id },
                    gift: { id: gift.id }
                });

                if (isUsedGift)
                    throw new BadRequestException([ 'شما قبلا از این کد تخفیف استفاده کرده اید' ]);
            }

            if ((gift.planIds || []).filter(p => p === plan.id).length === 0)
                throw new BadRequestException([ 'کد تخفیف برای طرح انتخاب شده نیست' ]);

            discount = { rate: gift.discountRate, duration: gift.duration };
            duration = gift.duration;
        }

        let entity = new Order();

        entity.gift = gift;
        entity.branch = branch;
        entity.number = this.orderRepository.findMaxNumber() + 1;
        entity.issuedDate = new Date();
        entity.plan = plan;
        entity.duration = duration;
        entity.unitPrice = plan.price;
        entity.discount = discount ? (plan.price * duration * discount.rate) / 100 : 0;

        await this.orderRepository.save(entity);

        if (entity.payable === 0)
            return this.complete(entity);

        return { id: entity.id };
    }

    async confirm(id: string): Promise<any> {
        const entity = await this.orderRepository.findOne({ id });

        if (!entity)
            throw new NotFoundException();

        return this.complete(entity);
    }

    async setAsPaid(id: string): Promise<void> {
        const entity = await this.orderRepository.findOne({ id });

        if (!entity)
            throw new NotFoundException();

        entity.paidDate = new Date();

        await this.orderRepository.save(entity);

        this.eventPublisher.publish(new OrderCompletedEvent(entity.id));

        try {
            const result = await new HttpRequest()
                .method(HttpMethod.POST, `${ this.config.ORIGIN_URL }/v1/sales/${ entity.invoiceId }/confirm`)
                .setHeader('x-access-token', this.config.STORM_BRANCH_TOKEN)
                .execute();

            console.log(result);
        } catch (e) {
            console.log('Error on set status confirm');

            console.log(e);
        }
    }

    private async complete(entity: Order): Promise<any> {
        if (entity.payable === 0) {
            this.eventPublisher.publish(new OrderCompletedEvent(entity.id));

            return { noPrice: true, id: entity.id };
        }

        if (entity.invoiceId)
            return { invoiceId: entity.invoiceId, paymentUrl: this.getPaymentUrl(entity) };


        await this.createInvoice(entity);

        return { invoiceId: entity.invoiceId, paymentUrl: this.getPaymentUrl(entity) };
    }

    private async createInvoice(entity: Order): Promise<void> {
        let dto: any = {
            date: PersianDate.getDate(entity.issuedDate),
            customer: { referenceId: entity.branch.id, title: entity.branch.name },
            status: 'draft',
            invoiceLines: [
                {
                    product: { referenceId: entity.plan.id, title: entity.plan.title, productType: 'service' },
                    quantity: entity.duration,
                    unitPrice: entity.unitPrice,
                    discount: entity.discount,
                    vat: 0, tax: 0
                }
            ]
        };

        try {
            const result: { id: string } = await new HttpRequest()
                .method(HttpMethod.POST, `${ this.config.ORIGIN_URL }/v1/sales`)
                .body(dto)
                .setHeader('x-access-token', this.config.STORM_BRANCH_TOKEN)
                .execute();

            entity.invoiceId = result.id;

            await this.orderRepository.save(entity);
        } catch (e) {
            throw new Error('Error on STORM branch')
        }
    }

    private getPaymentUrl(entity: Order): string {
        const returnUrl = `${ this.config.ORIGIN_URL }/${ entity.id }/payment/callback`,
            queryString = {
                branchId: this.config.STORM_BRANCH_ID,
                payment_gateway: 'zarinpal',
                return_url: returnUrl
            };

        return `${ this.config.ORIGIN_URL }/v1/payment-invoice/${ entity.invoiceId }/?${ qs.stringify(queryString) }`;
    }
}