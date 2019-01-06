import {validate, ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';

export function Validate(Type: new (...args: any[]) => any, index: number = 0) {
    return function (target, key, descriptor) {
        let func = descriptor.value;

        descriptor.value = async function () {
            const data = arguments[index],
                instance = plainToClass(Type, data),
                validationResult: ValidationError[] = await validate(instance);

            if (validationResult.length > 0) {
                let errors: string[] = validationResult.asEnumerable()
                    .selectMany(item =>
                        Object.keys(item.constraints).map(key => item.constraints[key]))
                    .toArray();

                console.log('Validation => ');
                console.log(JSON.stringify(errors));

                throw new ValidationException(errors);
            }

            return func.apply(this, arguments);
        }
    }
}