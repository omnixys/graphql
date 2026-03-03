import { Field, InputType } from '@nestjs/graphql';
import { GenderType, MaritalStatusType } from '@omnixys/contracts';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class PersonalInfoInput {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @IsString()
  firstName!: string;

  @Field(() => String)
  @IsString()
  lastName!: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  birthDate?: Date;

  @Field(() => GenderType, { nullable: true })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field(() => MaritalStatusType, { nullable: true })
  @IsOptional()
  @IsEnum(MaritalStatusType)
  maritalStatus?: MaritalStatusType;
}
