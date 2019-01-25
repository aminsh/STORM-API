import { Column, Entity } from "typeorm";

@Entity('storm_plans')
export class Plan {
    id: string;
    name: string;
    title: string;
    desciption: string;
    price: number;
    category: PlanCategory;

    @Column('json')
    discount: PlanDiscount[];

    @Column('json')
    features: PlanFeature;
}

interface PlanDiscount {
    duration: number;
    rate: number;
}

interface PlanFeature {
    dashboard: string[];
    api: string[];
}

export enum PlanCategory {
    FREE = 'Free',
    TRIAL = 'Trial',
    ECONOMIC = 'Economic',
    PROFESSIONAL = 'Professional',
    ENTERPRISE = 'Enterprise'
}
