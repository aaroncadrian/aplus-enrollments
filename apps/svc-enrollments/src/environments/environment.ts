import { SvcEnrollmentsEnvironment } from './svc-enrollments-environment.interface';

export const environment: SvcEnrollmentsEnvironment = {
  production: false,

  dynamodb: {
    clientConfig: {
      endpoint: 'http://localhost:8000',
    },
    enrollmentsTable: {
      tableName: 'aplus-enrollments',
      listPersonEnrollmentsIndexName: 'gsi1',
    },
  },
};
