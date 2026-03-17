import { Field, ID, InputType } from '@nestjs/graphql';
import { ContactOptionsType, StatusType } from '@omnixys/contracts';
import { IsBoolean, IsEnum } from 'class-validator';

@InputType()
export class CustomerInput {
  @Field(() => Boolean)
  @IsBoolean()
  subscribed!: boolean;

  @Field(() => StatusType, { defaultValue: StatusType.ACTIVE, nullable: true })
  @IsEnum(StatusType)
  state?: StatusType;

  @Field(() => [ID], { nullable: true })
  interestIds!: string[];

  @Field(() => [ContactOptionsType])
  contactOptions!: ContactOptionsType[];
}
