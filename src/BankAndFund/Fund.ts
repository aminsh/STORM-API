import {DetailAccount} from "../../../oldSource/TS/src/Accounting/Domain/DetailAccount";
import {ChildEntity} from "typeorm";

@ChildEntity('fund')
export class Fund extends DetailAccount {

}