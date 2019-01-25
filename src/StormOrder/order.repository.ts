import { Brackets, EntityRepository, Repository } from "typeorm";
import { Order } from "./order.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { User } from "../User/user.entity";
import { PlanCategory } from "./plan.entity";

@Injectable()
@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async isUsedTrial(owner: User): Promise<boolean> {
        const result = this.createQueryBuilder('order')
            .leftJoinAndSelect('order.plan', 'plan')
            .leftJoinAndSelect('order.branch', 'branch')
            .leftJoinAndSelect('branch.owner', 'user')
            .where('plan.category = :category', { category : PlanCategory.TRIAL })
            .where(new Brackets(db => {
                if (owner.email)
                    db.where(`user.email ILIKE ':email'`, { email : owner.email });
                if (owner.mobile)
                    db.orWhere(`user.mobile ILIKE ':mobile'`, { mobile : owner.mobile });
            }))
            .getOne();

        return !!result;
    }

    async findMaxNumber(): Promise<number> {
        const result: { maxNumber: number } = await this.createQueryBuilder('order')
            .select('MAX(order.number) as "maxNumber"')
            .getRawOne();

        return (result.maxNumber || 0);
    }
}