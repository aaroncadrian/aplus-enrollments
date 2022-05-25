export const getPersonEnrollmentKey = (props: { personId: string }): string => {
  const { personId } = props;

  return ['P', personId, 'E'].join('#');
};
