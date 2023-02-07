import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import constants from "@server/utils/Constants";

@ValidatorConstraint({ name: "categoryMap", async: false })
export class IsCategoryMap implements ValidatorConstraintInterface {
  validate(obj: object, args: ValidationArguments) {
    return (
      Object.keys(obj).every((key) => constants.allowed.categories.includes(key)) &&
      Object.values(obj).every((o) => Array.isArray(o) && o.every((item) => typeof item === "string"))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return "Incorrect category map";
  }
}
