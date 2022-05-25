import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentCommandInput {
  @IsString()
  @IsNotEmpty()
  rosterGroupId: string;

  @IsString()
  @IsNotEmpty()
  rosterId: string;

  @IsString()
  @IsNotEmpty()
  personId: string;
}
