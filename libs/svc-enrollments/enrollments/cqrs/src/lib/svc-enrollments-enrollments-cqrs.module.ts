import { Module } from '@nestjs/common';
import { ListRosterEnrollmentsHandler } from './list-roster-enrollments/list-roster-enrollments.handler';
import { CreateEnrollmentHandler } from './create-enrollment/create-enrollment.handler';
import { DeleteEnrollmentHandler } from './delete-enrollment/delete-enrollment.handler';
import { DescribeEnrollmentHandler } from './describe-enrollment/describe-enrollment.handler';
import { ListPersonEnrollmentsHandler } from './list-person-enrollments/list-person-enrollments.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [
    ListPersonEnrollmentsHandler,
    ListRosterEnrollmentsHandler,
    CreateEnrollmentHandler,
    DescribeEnrollmentHandler,
    DeleteEnrollmentHandler,
  ],
  exports: [
    CqrsModule,
    ListPersonEnrollmentsHandler,
    ListRosterEnrollmentsHandler,
    CreateEnrollmentHandler,
    DescribeEnrollmentHandler,
    DeleteEnrollmentHandler,
  ],
})
export class SvcEnrollmentsEnrollmentsCqrsModule {}
