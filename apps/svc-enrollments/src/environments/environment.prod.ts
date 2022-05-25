import { SvcEnrollmentsEnvironment } from './svc-enrollments-environment.interface';

export const environment: SvcEnrollmentsEnvironment = {
  production: true,

  dynamodb: {
    enrollmentsTable: {
      tableName: process.env.ENROLLMENTS_TABLE_NAME,
      listPersonEnrollmentsIndexName:
        process.env.LIST_PERSON_ENROLLMENTS_INDEX_NAME,
    },
  },
};
