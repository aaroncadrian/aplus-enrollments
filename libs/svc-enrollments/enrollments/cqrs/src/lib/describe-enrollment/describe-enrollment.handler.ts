import { Inject } from '@nestjs/common';
import { DescribeEnrollmentCommandInput } from './describe-enrollment.command-input';
import { DescribeEnrollmentCommandOutput } from './describe-enrollment.command-output';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '@aplus/svc-enrollments/enrollments/domain';
import { ENROLLMENTS_TABLE_NAME } from '@aplus/svc-enrollments/config/util-tokens';
import { getEnrollmentKey } from '../_internal/enrollment.keys';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DescribeEnrollmentCommandInput)
export class DescribeEnrollmentHandler
  implements
    ICommandHandler<
      DescribeEnrollmentCommandInput,
      DescribeEnrollmentCommandOutput
    >
{
  constructor(
    private dynamo: DynamoDBClient,
    @Inject(ENROLLMENTS_TABLE_NAME)
    private enrollmentsTableName: string
  ) {}

  public async execute(
    input: DescribeEnrollmentCommandInput
  ): Promise<DescribeEnrollmentCommandOutput> {
    const { rosterGroupId, rosterId, enrollmentId } = input;

    const enrollmentResult = await this.dynamo.send(
      new GetItemCommand({
        TableName: this.enrollmentsTableName,
        Key: marshall(
          getEnrollmentKey({
            rosterGroupId,
            rosterId,
            enrollmentId,
          })
        ),
        ProjectionExpression: '#data',
        ExpressionAttributeNames: {
          '#data': 'data',
        },
      })
    );

    if (!enrollmentResult.Item) {
      return {
        record: null,
      };
    }

    const item = unmarshall(enrollmentResult.Item) as { data: Enrollment };

    const record = item.data;

    return {
      record,
    };
  }
}
