export const getEnrollmentPersonPk = (props: {
  rosterGroupId: string;
  rosterId: string;
}): string => {
  const { rosterGroupId, rosterId } = props;

  return ['G', rosterGroupId, 'R', rosterId, 'P'].join('#');
};

export const getEnrollmentPersonSk = (props: { personId: string }): string => {
  const { personId } = props;

  return [personId].join('#');
};

export const getEnrollmentPersonKey = (
  props: Parameters<typeof getEnrollmentPersonPk>[0] &
    Parameters<typeof getEnrollmentPersonSk>[0]
): { pk: string; sk: string } => {
  return {
    pk: getEnrollmentPersonPk(props),
    sk: getEnrollmentPersonSk(props),
  };
};
