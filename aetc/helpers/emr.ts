import { Obs } from "@/interfaces";

export const getObservationValue = (obs: any, uuid: string) => {


  if (!obs) {
    return null;
  }
  const ob = obs.find((ob: any) => {
    return ob.names.find((n: any) => n.uuid == uuid);
  });

  if (!ob) {
    return null;
  }

  return ob.value;
};

export const getObservation = (obs: any, uuid: string): Obs | null => {

  if (!obs) {
    return null;
  }
  return obs.find((ob: any) => {
    return ob.names.find((n: any) => n.uuid == uuid);
  });

};

