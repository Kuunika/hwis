export const getObservationValue = (obs: any, uuid: string) => {
  const ob = obs.find((ob: any) => {
    return ob.names.find((n: any) => n.uuid == uuid);
  });

  if (!ob) {
    return null;
  }

  return ob.value;
};
