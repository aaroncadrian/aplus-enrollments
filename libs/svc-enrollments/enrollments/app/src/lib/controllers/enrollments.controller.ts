import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateEnrollmentCommandInput,
  DeleteEnrollmentCommandInput,
  DescribeEnrollmentCommandInput,
  ListPersonEnrollmentsCommandInput,
  ListRosterEnrollmentsCommandInput,
} from '@aplus/svc-enrollments/enrollments/cqrs';
import { CommandBus } from '@nestjs/cqrs';

@Controller()
export class EnrollmentsController {
  constructor(private commandBus: CommandBus) {}

  @Post('ListPersonEnrollments')
  public ListPersonEnrollments(
    @Body() input: ListPersonEnrollmentsCommandInput
  ) {
    return this.commandBus.execute(input);
  }

  @Post('ListRosterEnrollments')
  public ListRosterEnrollments(
    @Body() input: ListRosterEnrollmentsCommandInput
  ) {
    return this.commandBus.execute(input);
  }

  @Post('CreateEnrollment')
  public CreateEnrollment(@Body() input: CreateEnrollmentCommandInput) {
    return this.commandBus.execute(input);
  }

  @Post('DescribeEnrollment')
  public DescribeEnrollment(@Body() input: DescribeEnrollmentCommandInput) {
    return this.commandBus.execute(input);
  }

  @Post('DeleteEnrollment')
  public DeleteEnrollment(@Body() input: DeleteEnrollmentCommandInput) {
    return this.commandBus.execute(input);
  }
}
