import { Field, GraphQLISODateTime, ID, InputType } from "@nestjs/graphql";
import { RelationshipType } from "@omnixys/shared";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class ContactInput {
  @Field(() => String)
  @IsString()
  contactId!: string;

  @Field(() => RelationshipType)
  @IsEnum(RelationshipType)
  relationship!: RelationshipType;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  withdrawalLimit?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  emergency?: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  endDate?: Date;
}

/**
 * Input type for adding a phone number to a user.
 */
@InputType()
export class AddContactInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => String)
  Contact!: ContactInput;
}

/**
 * Input type for removing a phone number from a user.
 */
@InputType()
export class RemoveContactInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => ID)
  @IsString()
  contactId!: string;
}
