import { Type } from "class-transformer";
import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import { UserType } from "@omnixys/contracts";
import { IsBoolean, IsString, Length } from "class-validator";
import { UserAddressInput } from "./address.input.js";
import { ContactInput } from "./contact.input.js";
import { CustomerInput } from "./customer.input.js";
import { EmployeeInput } from "./employee.input.js";
import { PersonalInfoInput } from "./personal-info.input.js";
import { PhoneNumberInput } from "./phone-number.input.js";
import { AddSecurityQuestionInput } from "./security-question.input.js";

/**
 * Input type for creating a new user.
 * Corresponds to fields in the User entity.
 */
@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @Length(8, 32)
  username!: string;

  @Field(() => String)
  @IsString()
  @Length(8, 32)
  password!: string;

  @Field(() => UserType)
  userType!: UserType;

  @Field(() => PersonalInfoInput)
  personalInfo!: PersonalInfoInput;

  @Field(() => [PhoneNumberInput], { nullable: true })
  @Type(() => PhoneNumberInput)
  phoneNumbers?: PhoneNumberInput[];

  @Field(() => [UserAddressInput], { nullable: true })
  @Type(() => UserAddressInput)
  addresses?: UserAddressInput[];

  @Field(() => CustomerInput, { nullable: true })
  customer?: CustomerInput;

  @Field(() => EmployeeInput, { nullable: true })
  employee?: EmployeeInput;

  @Field(() => [ContactInput], { nullable: true })
  @Type(() => ContactInput)
  contacts?: ContactInput[];

  @Field(() => [AddSecurityQuestionInput], { nullable: true })
  @Type(() => AddSecurityQuestionInput)
  securityQuestions?: AddSecurityQuestionInput[];

  @Field(() => Boolean)
  @IsBoolean()
  acceptedTerms!: boolean;

  @Field(() => GraphQLISODateTime)
  acceptedTermsAt!: Date;
}
