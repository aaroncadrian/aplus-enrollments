export interface SvcEnrollmentsEnvironment {
  production: boolean;

  dynamodb: {
    clientConfig?: {
      endpoint?: string;
    };
    enrollmentsTable: {
      tableName: string;
      listPersonEnrollmentsIndexName: string;
    };
  };
}
