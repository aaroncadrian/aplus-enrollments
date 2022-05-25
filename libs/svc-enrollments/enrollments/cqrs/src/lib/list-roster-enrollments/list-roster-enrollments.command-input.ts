import { IsNotEmpty, IsString } from 'class-validator';

export class ListRosterEnrollmentsCommandInput {
  @IsString()
  @IsNotEmpty()
  rosterGroupId: string;

  @IsString()
  @IsNotEmpty()
  rosterId: string;
}
