import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SvcEnrollmentsEnrollmentsAppModule } from '@aplus/svc-enrollments/enrollments/app';
import { APP_PIPE } from '@nestjs/core';
import { DynamoDbModule } from './dynamodb.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DynamoDbModule, SvcEnrollmentsEnrollmentsAppModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
