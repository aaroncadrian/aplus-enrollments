import { IsNotEmpty, IsString } from 'class-validator';

export class ListPersonEnrollmentsCommandInput {
  @IsString()
  @IsNotEmpty()
  personId: string;
}
