import { Global, Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  ENROLLMENTS_TABLE_NAME,
  LIST_PERSON_ENROLLMENTS_INDEX_NAME,
} from '@aplus/svc-enrollments/config/util-tokens';
import { environment } from '../environments/environment';

@Global()
@Module({
  providers: [
    {
      provide: DynamoDBClient,
      useValue: new DynamoDBClient({
        endpoint: environment.dynamodb.clientConfig?.endpoint,
      }),
    },
    {
      provide: ENROLLMENTS_TABLE_NAME,
      useValue: environment.dynamodb.enrollmentsTable.tableName,
    },
    {
      provide: LIST_PERSON_ENROLLMENTS_INDEX_NAME,
      useValue:
        environment.dynamodb.enrollmentsTable.listPersonEnrollmentsIndexName,
    },
  ],
  exports: [
    DynamoDBClient,
    ENROLLMENTS_TABLE_NAME,
    LIST_PERSON_ENROLLMENTS_INDEX_NAME,
  ],
})
export class DynamoDbModule {}
