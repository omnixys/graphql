import { StatusType } from '../../enums/status-type.enum.js';
import { Field, ID, InputType } from '@nestjs/graphql';
import { ContactOptionsType } from '@omnixys/contracts';
import { IsBoolean, IsEnum } from 'class-validator';

@InputType()
export class CustomerInput {
  @Field(() => Boolean)
  @IsBoolean()
  subscribed!: boolean;

  @Field(() => StatusType, { defaultValue: StatusType.ACTIVE, nullable: true })
  @IsEnum(StatusType)
  state?: StatusType;

  @Field(() => [ID])
  interests!: string[];

  @Field(() => [ContactOptionsType])
  contactOptions!: ContactOptionsType[];
}
