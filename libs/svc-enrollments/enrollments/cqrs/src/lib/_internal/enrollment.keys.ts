export const getEnrollmentPk = (props: {
  rosterGroupId: string;
  rosterId: string;
}): string => {
  const { rosterGroupId, rosterId } = props;

  return ['G', rosterGroupId, 'R', rosterId, 'E'].join('#');
};

export const getEnrollmentSk = (props: { enrollmentId: string }): string => {
  const { enrollmentId } = props;

  return [enrollmentId].join('#');
};

export const getEnrollmentKey = (
  props: Parameters<typeof getEnrollmentPk>[0] &
    Parameters<typeof getEnrollmentSk>[0]
): { pk: string; sk: string } => {
  return {
    pk: getEnrollmentPk(props),
    sk: getEnrollmentSk(props),
  };
};
