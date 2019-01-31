import { FindOperator, Raw } from "typeorm";

export  function ILike(value: string): FindOperator<any> {
    return Raw(value);
}