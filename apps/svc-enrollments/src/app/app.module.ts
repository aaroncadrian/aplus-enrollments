import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SvcEnrollmentsEnrollmentsAppModule } from '@aplus/svc-enrollments/enrollments/app';
import { APP_PIPE } from '@nestjs/core';
import { DynamoDbModule } from './dynamodb.module';

@Module({
  imports: [DynamoDbModule, SvcEnrollmentsEnrollmentsAppModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(),
    },
  ],
})
export class AppModule {}
