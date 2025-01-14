import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IsValidMongoId', async: false })
export class IsValidMongoId implements ValidatorConstraintInterface {
  validate(id: string) {
    return Types.ObjectId.isValid(id);
  }

  defaultMessage(args: ValidationArguments) {
    return `The some value of ${args.value} is not a valid MongoId`;
  }
}
