import { Field, ID, InputType } from "@nestjs/graphql";
import { IsString, Length, IsEnum, IsOptional } from "class-validator";

@InputType()
export class UserAddressInput {
  @Field(() => String)
  @IsString()
  @Length(1, 255)
  street!: string;

  @Field(() => String)
  @IsString()
  houseNumber!: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  postalCodeId?: string;

  @Field(() => ID)
  @IsString()
  cityId!: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  stateId?: string;

  @Field(() => ID)
  @IsString()
  countryId!: string;

  @Field(() => String)
  addressType!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

/**
 * Input type for adding a phone number to a user.
 */
@InputType()
export class AddAddressInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => String)
  @IsString()
  @Length(3, 32)
  address!: UserAddressInput;
}

/**
 * Input type for removing a phone number from a user.
 */
@InputType()
export class RemoveAddressInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => ID)
  @IsString()
  addressId!: string;
}
