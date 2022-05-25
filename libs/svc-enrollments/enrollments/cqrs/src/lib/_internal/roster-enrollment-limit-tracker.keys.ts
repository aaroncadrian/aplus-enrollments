export const getRosterEnrollmentLimitTrackerPk = (props: {
  rosterGroupId: string;
  rosterId: string;
}): string => {
  const { rosterGroupId, rosterId } = props;

  return ['G', rosterGroupId, 'R', rosterId, 'ENROLLMENT_LIMIT_TRACKER'].join(
    '#'
  );
};

export const getRosterEnrollmentLimitTrackerSk = (): string => {
  return ['DATA'].join('#');
};

export const getRosterEnrollmentLimitTrackerKey = (
  props: Parameters<typeof getRosterEnrollmentLimitTrackerPk>[0]
): { pk: string; sk: string } => {
  return {
    pk: getRosterEnrollmentLimitTrackerPk(props),
    sk: getRosterEnrollmentLimitTrackerSk(),
  };
};
