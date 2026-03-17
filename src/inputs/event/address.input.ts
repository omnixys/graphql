import { Field, InputType } from "@nestjs/graphql";
import { IsString, Length,  IsOptional } from "class-validator";

@InputType()
export class EventAddressInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  street?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  city!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  country!: string;

  @Field(() => String, { nullable: true })
  eventType?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}