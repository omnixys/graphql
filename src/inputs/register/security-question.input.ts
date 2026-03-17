// add-security-question.input.ts
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AddSecurityQuestionInput {
  @Field(() => ID)
  questionId!: string;

  @Field(() => String)
  answer!: string;
}
