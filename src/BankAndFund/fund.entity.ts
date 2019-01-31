import {ChildEntity} from "typeorm";
import { DetailAccount } from "../Accounting/Domain/detailAccount.entity";

@ChildEntity('fund')
export class Fund extends DetailAccount {
}