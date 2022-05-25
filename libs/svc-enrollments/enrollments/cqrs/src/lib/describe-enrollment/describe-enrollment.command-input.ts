import { IsNotEmpty, IsString } from 'class-validator';

export class DescribeEnrollmentCommandInput {
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
