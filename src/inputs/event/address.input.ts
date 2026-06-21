import { Field, ID, InputType } from "@nestjs/graphql";
import { EventAddress } from "@omnixys/contracts";
import { IsString, Length, IsOptional } from "class-validator";

@InputType()
export class EventAddressInput implements EventAddress {
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

  @Field(() => String)
  @IsString()
  city!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field(() => String)
  @IsString()
  country!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
