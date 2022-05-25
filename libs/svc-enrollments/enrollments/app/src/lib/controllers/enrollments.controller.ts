import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateEnrollmentCommandInput,
  CreateEnrollmentHandler,
  DeleteEnrollmentCommandInput,
  DeleteEnrollmentHandler,
  DescribeEnrollmentCommandInput,
  DescribeEnrollmentHandler,
  ListPersonEnrollmentsCommandInput,
  ListPersonEnrollmentsHandler,
  ListRosterEnrollmentsCommandInput,
  ListRosterEnrollmentsHandler,
} from '@aplus/svc-enrollments/enrollments/cqrs';

@Controller()
export class EnrollmentsController {
  constructor(
    private listPersonEnrollmentsHandler: ListPersonEnrollmentsHandler,
    private listRosterEnrollmentsHandler: ListRosterEnrollmentsHandler,
    private createEnrollmentHandler: CreateEnrollmentHandler,
    private describeEnrollmentHandler: DescribeEnrollmentHandler,
    private deleteEnrollmentHandler: DeleteEnrollmentHandler
  ) {}

  @Post('ListPersonEnrollments')
  public ListPersonEnrollments(
    @Body() input: ListPersonEnrollmentsCommandInput
  ) {
    return this.listPersonEnrollmentsHandler.handle(input);
  }

  @Post('ListRosterEnrollments')
  public ListRosterEnrollments(
    @Body() input: ListRosterEnrollmentsCommandInput
  ) {
    return this.listRosterEnrollmentsHandler.handle(input);
  }

  @Post('CreateEnrollment')
  public CreateEnrollment(@Body() input: CreateEnrollmentCommandInput) {
    return this.createEnrollmentHandler.handle(input);
  }

  @Post('DescribeEnrollment')
  public DescribeEnrollment(@Body() input: DescribeEnrollmentCommandInput) {
    return this.describeEnrollmentHandler.handle(input);
  }

  @Post('DeleteEnrollment')
  public DeleteEnrollment(@Body() input: DeleteEnrollmentCommandInput) {
    return this.deleteEnrollmentHandler.handle(input);
  }
}
