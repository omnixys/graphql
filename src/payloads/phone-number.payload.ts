import { Directive, Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { PhoneNumberType } from '@omnixys/shared';
import { IsOptional, IsString } from 'class-validator';

/**
 * Represents a phone number linked to a specific user.
 */
@ObjectType()
@Directive("@shareable")
export class PhoneNumberPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  number!: string;

  @Field(() => PhoneNumberType)
  type!: PhoneNumberType;

  @Field(() => String)
  infoId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  label?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isPrimary!: boolean;

  @Field(() => String)
  @IsString()
  countryCode!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
