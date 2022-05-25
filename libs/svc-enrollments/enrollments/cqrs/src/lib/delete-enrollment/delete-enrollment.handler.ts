import { Inject, Injectable } from '@nestjs/common';
import { DeleteEnrollmentCommandInput } from './delete-enrollment.command-input';
import { DeleteEnrollmentCommandOutput } from './delete-enrollment.command-output';
import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '@aplus/svc-enrollments/enrollments/domain';
import { ENROLLMENTS_TABLE_NAME } from '@aplus/svc-enrollments/config/util-tokens';
import invariant from 'tiny-invariant';
import { getEnrollmentKey } from '../_internal/enrollment.keys';
import { getEnrollmentPersonKey } from '../_internal/roster-enrollment-person.keys';
import { getRosterEnrollmentLimitTrackerKey } from '../_internal/roster-enrollment-limit-tracker.keys';

@Injectable()
export class DeleteEnrollmentHandler {
  constructor(
    private dynamo: DynamoDBClient,
    @Inject(ENROLLMENTS_TABLE_NAME)
    private enrollmentsTableName: string
  ) {}

  public async handle(
    input: DeleteEnrollmentCommandInput
  ): Promise<DeleteEnrollmentCommandOutput> {
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

    invariant(
      enrollmentResult.Item,
      'Unexpected Condition: Item should be defined when getting Enrollment'
    );

    const item = unmarshall(enrollmentResult.Item) as { data: Enrollment };

    const record = item.data;

    const personId = record.personId;

    await this.dynamo.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Delete: {
              TableName: this.enrollmentsTableName,
              Key: marshall(
                getEnrollmentKey({
                  rosterGroupId,
                  rosterId,
                  enrollmentId,
                })
              ),
            },
          },
          {
            Delete: {
              TableName: this.enrollmentsTableName,
              Key: marshall(
                getEnrollmentPersonKey({
                  rosterGroupId,
                  rosterId,
                  personId,
                })
              ),
            },
          },
          {
            Update: {
              TableName: this.enrollmentsTableName,
              Key: marshall(
                getRosterEnrollmentLimitTrackerKey({
                  rosterGroupId,
                  rosterId,
                })
              ),
              UpdateExpression: `
                DELETE #enrollmentIds :enrollmentIds
              `,
              ExpressionAttributeNames: {
                '#enrollmentIds': 'enrollmentIds',
              },
              ExpressionAttributeValues: marshall({
                ':enrollmentIds': new Set<string>([enrollmentId]),
              }),
            },
          },
        ],
      })
    );

    return {
      record,
    };
  }
}
