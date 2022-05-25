import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteEnrollmentCommandInput {
  @IsString()
  @IsNotEmpty()
  rosterGroupId: string;

  @IsString()
  @IsNotEmpty()
  rosterId: string;

  @IsString()
  @IsNotEmpty()
  enrollmentId: string;
}
