import { Inject } from '@nestjs/common';
import { ListRosterEnrollmentsCommandInput } from './list-roster-enrollments.command-input';
import { ListRosterEnrollmentsCommandOutput } from './list-roster-enrollments.command-output';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '@aplus/svc-enrollments/enrollments/domain';
import { ENROLLMENTS_TABLE_NAME } from '@aplus/svc-enrollments/config/util-tokens';
import { getEnrollmentPk } from '../_internal/enrollment.keys';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(ListRosterEnrollmentsCommandInput)
export class ListRosterEnrollmentsHandler
  implements
    ICommandHandler<
      ListRosterEnrollmentsCommandInput,
      ListRosterEnrollmentsCommandOutput
    >
{
  constructor(
    private dynamo: DynamoDBClient,
    @Inject(ENROLLMENTS_TABLE_NAME)
    private enrollmentsTableName: string
  ) {}

  public async execute(
    input: ListRosterEnrollmentsCommandInput
  ): Promise<ListRosterEnrollmentsCommandOutput> {
    const { rosterGroupId, rosterId } = input;

    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: this.enrollmentsTableName,
        KeyConditionExpression: '#pk = :pk',
        ProjectionExpression: '#data',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#data': 'data',
        },
        ExpressionAttributeValues: marshall({
          ':pk': getEnrollmentPk({
            rosterGroupId,
            rosterId,
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
