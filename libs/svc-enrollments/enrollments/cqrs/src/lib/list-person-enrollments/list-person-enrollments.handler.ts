import { Inject } from '@nestjs/common';
import { ListPersonEnrollmentsCommandInput } from './list-person-enrollments.command-input';
import { ListPersonEnrollmentsCommandOutput } from './list-person-enrollments.command-output';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '@aplus/svc-enrollments/enrollments/domain';
import {
  ENROLLMENTS_TABLE_NAME,
  LIST_PERSON_ENROLLMENTS_INDEX_NAME,
} from '@aplus/svc-enrollments/config/util-tokens';
import { getPersonEnrollmentKey } from '../_internal/person-enrollment.keys';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(ListPersonEnrollmentsCommandInput)
export class ListPersonEnrollmentsHandler
  implements
    ICommandHandler<
      ListPersonEnrollmentsCommandInput,
      ListPersonEnrollmentsCommandOutput
    >
{
  constructor(
    private dynamo: DynamoDBClient,
    @Inject(ENROLLMENTS_TABLE_NAME)
    private enrollmentsTableName: string,
    @Inject(LIST_PERSON_ENROLLMENTS_INDEX_NAME)
    private listPersonEnrollmentsIndexName: string
  ) {}

  public async execute(
    input: ListPersonEnrollmentsCommandInput
  ): Promise<ListPersonEnrollmentsCommandOutput> {
    const { personId } = input;

    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: this.enrollmentsTableName,
        IndexName: this.listPersonEnrollmentsIndexName,
        KeyConditionExpression: '#gsi1pk = :gsi1pk',
        ProjectionExpression: '#data',
        ExpressionAttributeNames: {
          '#gsi1pk': 'gsi1pk',
          '#data': 'data',
        },
        ExpressionAttributeValues: marshall({
          ':gsi1pk': getPersonEnrollmentKey({
            personId,
          }),
        }),
      })
    );

    const records = result.Items?.map(
      (item) =>
        unmarshall(item) as {
          data: Enrollment;
        }
    ).map((item) => item.data);

    return {
      records,
    };
  }
}
