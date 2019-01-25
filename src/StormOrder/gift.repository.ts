import { EntityRepository, Repository } from "typeorm";
import { Gift } from "./gift.entity";
import { Injectable } from "../Infrastructure/DependencyInjection";

@Injectable()
@EntityRepository(Gift)
export class GiftRepository extends Repository<Gift> {
}
