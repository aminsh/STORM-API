import { EntityRepository, Repository } from "typeorm";
import { Plan } from "./plan.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";

@Injectable()
@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {
}