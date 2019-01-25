import {validate, ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';
import {BadRequestException} from "../Exceptions";
import {Enumerable} from "../Utility";

interface ValidateOptions {
    index?: number,
    transform?: (...args: any[]) => void
}

export function Validate(Type: new (...args: any[]) => any,
                         options: ValidateOptions = {index: 0}): Function {
    return function (target, key, descriptor) {
        let func = descriptor.value;

        descriptor.value = async function () {
            const data = arguments[options.index];

            if (typeof options.transform === 'function')
                options.transform(...arguments);

            const instance = plainToClass(Type, data),
                validationResult: ValidationError[] = await validate(instance);

            if (validationResult.length > 0) {
                let errors: string[] = Enumerable.from(validationResult)
                    .selectMany(item =>
                        Object.keys(item.constraints).map(key => item.constraints[key]))
                    .toArray();

                console.log('Validation => ');
                console.log(JSON.stringify(errors));

                throw new BadRequestException(errors);
            }

            return func.apply(this, arguments);
        }
    }
}