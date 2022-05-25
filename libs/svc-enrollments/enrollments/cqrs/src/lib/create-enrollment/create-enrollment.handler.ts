import { Inject } from '@nestjs/common';
import { CreateEnrollmentCommandInput } from './create-enrollment.command-input';
import { CreateEnrollmentCommandOutput } from './create-enrollment.command-output';
import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Enrollment } from '@aplus/svc-enrollments/enrollments/domain';
import { nanoid } from 'nanoid';
import { ENROLLMENTS_TABLE_NAME } from '@aplus/svc-enrollments/config/util-tokens';
import { getEnrollmentPersonKey } from '../_internal/roster-enrollment-person.keys';
import { getEnrollmentKey } from '../_internal/enrollment.keys';
import { getRosterEnrollmentLimitTrackerKey } from '../_internal/roster-enrollment-limit-tracker.keys';
import { getPersonEnrollmentKey } from '../_internal/person-enrollment.keys';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateEnrollmentCommandInput)
export class CreateEnrollmentHandler
  implements
    ICommandHandler<
      CreateEnrollmentCommandInput,
      CreateEnrollmentCommandOutput
    >
{
  constructor(
    private dynamo: DynamoDBClient,
    @Inject(ENROLLMENTS_TABLE_NAME)
    private enrollmentsTableName: string
  ) {}

  public async execute(
    input: CreateEnrollmentCommandInput
  ): Promise<CreateEnrollmentCommandOutput> {
    const { rosterGroupId, rosterId, personId } = input;

    const enrollmentId = nanoid();

    const enrollment: Enrollment = {
      id: enrollmentId,
      rosterGroupId,
      rosterId,
      personId,
    } as Enrollment;

    const tableName = this.enrollmentsTableName;

    await this.dynamo.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          // Create enrollment
          {
            Put: {
              TableName: tableName,
              Item: marshall({
                ...getEnrollmentKey({
                  rosterGroupId,
                  rosterId,
                  enrollmentId,
                }),
                data: enrollment,
                gsi1pk: getPersonEnrollmentKey({
                  personId,
                }),
              }),
            },
          },
          // Ensure person not already enrolled on roster
          {
            Put: {
              TableName: tableName,
              Item: marshall(
                getEnrollmentPersonKey({
                  rosterGroupId,
                  rosterId,
                  personId,
                })
              ),
              ConditionExpression: 'attribute_not_exists(#pk)',
              ExpressionAttributeNames: {
                '#pk': 'pk',
              },
            },
          },
          // Ensure roster limit not already met
          {
            Update: {
              TableName: tableName,
              Key: marshall(
                getRosterEnrollmentLimitTrackerKey({
                  rosterGroupId,
                  rosterId,
                })
              ),
              UpdateExpression: `
                ADD #enrollmentIds :enrollmentIds
              `,
              ConditionExpression: `
                attribute_not_exists(#limit) OR size(#enrollmentIds) < #limit
              `,
              ExpressionAttributeNames: {
                '#enrollmentIds': 'enrollmentIds',
                '#limit': 'limit',
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
      record: enrollment,
    };
  }
}
