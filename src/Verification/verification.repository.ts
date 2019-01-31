import { Injectable } from "../Infrastructure/DependencyInjection";
import { EntityRepository, Repository } from "typeorm";
import { Verification } from "./verification.entity";

@Injectable()
@EntityRepository()
export class VerificationRepository extends Repository<Verification> {
}