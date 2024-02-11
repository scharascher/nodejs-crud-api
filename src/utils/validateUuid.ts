export const validateUuid = (uuid: string) => {
  const pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return !pattern.test(uuid);
};
