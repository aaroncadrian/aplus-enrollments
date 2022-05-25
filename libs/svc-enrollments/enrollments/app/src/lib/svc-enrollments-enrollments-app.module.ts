import { Module } from '@nestjs/common';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { SvcEnrollmentsEnrollmentsCqrsModule } from '@aplus/svc-enrollments/enrollments/cqrs';

@Module({
  imports: [SvcEnrollmentsEnrollmentsCqrsModule],
  controllers: [EnrollmentsController],
})
export class SvcEnrollmentsEnrollmentsAppModule {}
