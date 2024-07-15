import { concepts } from "@/constants";
import { Obs } from "@/interfaces";
import dayjs from 'dayjs';


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

export const formatAllObsToObject = (obs:Obs[])=>{

  const oxygen=filterObservations(obs,concepts.OXYGEN_SATURATION);
  const heartRate=filterObservations(obs,concepts.HEART_RATE);
  const bloodPressureDiastolic=filterObservations(obs,concepts.BLOOD_PRESSURE_DIASTOLIC);
  const respiratoryRate=filterObservations(obs,concepts.RESPIRATORY_RATE);
  const bloodPressureSystolic=filterObservations(obs,concepts.BLOOD_PRESSURE_SYSTOLIC);
  const temperature=filterObservations(obs,concepts.TEMPERATURE);
  const glucose=filterObservations(obs,concepts.GLUCOSE);
  const AVPU=filterObservations(obs,concepts.AVPU);
}

export const filterObservations = (obs: Obs[], uuid: string): Obs[] | null => {

  if (!obs) {
    return null;
  }
  return obs.filter((ob: any) => {
    return ob.names.find((n: any) => n.uuid == uuid);
  }).sort((a:Obs,b:Obs)=>dayjs(a?.obs_datetime).isBefore(dayjs(b?.obs_datetime)) ? -1:1)
};

