import { Field, ID, InputType } from '@nestjs/graphql';
import { PhoneNumberType } from '@omnixys/shared';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

export const PHONE_RE = /^\+?[0-9 .\-()]{6,20}$/;

@InputType()
export class PhoneNumberInput {
  @Field(() => PhoneNumberType, {
    description:
      "The category/type of the phone number (e.g., MOBILE, HOME, WORK).",
  })
  @IsEnum(PhoneNumberType)
  type!: PhoneNumberType;

  @Field(() => String)
  @IsString()
  countryCode!: string;

  @Field(() => String, {
    description: "Phone number value in international format. Regex validated.",
  })
  @IsString()
  @Matches(PHONE_RE, { message: "invalid phone number format" })
  number!: string;

  @Field(() => String, {
    nullable: true,
    description:
      "Optional user-defined label (e.g., “Office Line”, “Private”).",
  })
  @IsOptional()
  @IsString()
  label?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: "Marks this number as primary for the associated profile.",
  })
  @IsOptional()
  isPrimary?: boolean;
}

/**
 * Input type for adding a phone number to a user.
 */
@InputType()
export class AddPhoneNumberInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => String)
  @IsString()
  @Length(3, 32)
  number!: string;

  @Field(() => PhoneNumberType)
  @IsEnum(PhoneNumberType)
  type!: PhoneNumberType;
}

/**
 * Input type for removing a phone number from a user.
 */
@InputType()
export class RemovePhoneNumberInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => ID)
  @IsString()
  phoneNumberId!: string;
}
