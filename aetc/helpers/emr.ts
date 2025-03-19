import { concepts, NO, YES } from "@/constants";
import {
  Encounter,
  Identifier,
  Obs,
  PatientUpdateResponse,
  Person,
} from "@/interfaces";
import dayjs from "dayjs";

export const getObservationValue = (obs: any, uuid: string) => {
  if (!obs) {
    return null;
  }
  const ob = obs.find((ob: any) => {
    const results = ob?.names?.find(
      (n: any) => n.name.toLowerCase() == uuid.toLowerCase()
    );

    return results;
  });

  if (!ob) {
    return null;
  }

  if (ob.value == YES) {
    return "Yes";
  }
  if (ob.value == NO) {
    return "No";
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

export const findEncounterObs = (
  data: Encounter[],
  encounter: string,
  visit: number
) => {
  const encounterData = data
    .filter((d) => d?.encounter_type.uuid == encounter)
    .find((d) => d.visit_id == visit);
  return encounterData?.obs ?? [];
};

export const formatAllVitalsToObject = (obs: Obs[]) => {
  const oxygen = filterObservations(obs, concepts.SATURATION_RATE);
  const heartRate = filterObservations(obs, concepts.HEART_RATE);

  const bloodPressureDiastolic = filterObservations(
    obs,
    concepts.SYSTOLIC_BLOOD_PRESSURE
  );
  const respiratoryRate = filterObservations(obs, concepts.RESPIRATORY_RATE);
  const bloodPressureSystolic = filterObservations(
    obs,
    concepts.DIASTOLIC_BLOOD_PRESSURE
  );
  const temperature = filterObservations(obs, concepts.TEMPERATURE);
  const glucose = filterObservations(obs, concepts.GLUCOSE);
  const avpu = filterObservations(obs, concepts.AVPU);
  const O_2Sat = filterObservations(obs, "Blood oxygen saturation");

  const results = [
    oxygen,
    heartRate,
    bloodPressureDiastolic,
    respiratoryRate,
    bloodPressureSystolic,
    temperature,
    glucose,
    avpu,
    O_2Sat,
  ];

  //  console.log({results});
  return formatAllObsToObject(results);
};

export const formatAllAirwayBreathing = (obs: Obs[]) => {
  const airWayCompromised = filterObservations(
    obs,
    concepts.IS_AIRWAY_COMPROMISED
  );
  const isBreathingNormal = filterObservations(
    obs,
    concepts.IS_BREATHING_ABNORMAL
  );
  const oxygenStats = filterObservations(obs, concepts.OXYGEN_STATS_89);
  const respiratoryRate = filterObservations(
    obs,
    concepts.RESPIRATORY_RATE_8_31
  );
  const severeRespiratory = filterObservations(
    obs,
    concepts.SEVERE_RESPIRATORY
  );
  const inabilityToSpeak = filterObservations(obs, concepts.INABILITY_TO_SPEAK);
  const reducedConsciousness = filterObservations(
    obs,
    concepts.REDUCED_LEVEL_CONSCIOUSNESS
  );
  const stridor = filterObservations(obs, concepts.STRIDOR);
  const oxygenStat9092 = filterObservations(obs, concepts.OXYGEN_STATS_90_92);
  const respiratoryRate92130 = filterObservations(
    obs,
    concepts.RESPIRATORY_RATE_9_21_30
  );

  const results = [
    airWayCompromised,
    isBreathingNormal,
    oxygenStats,
    respiratoryRate,
    severeRespiratory,
    inabilityToSpeak,
    reducedConsciousness,
    stridor,
    oxygenStat9092,
    respiratoryRate92130,
  ];

  return formatAllObsToObject(results);
};

export const formatAllCirculation = (obs: Obs[]) => {
  const isCirculationAbnormal = filterObservations(
    obs,
    concepts.IS_CIRCULATION_ABNORMAL
  );
  const weakIrregularPulse = filterObservations(obs, concepts.WEAK_THREADY);
  const heartRate = filterObservations(obs, concepts.HEART_RATE);
  const pulseRate = filterObservations(obs, concepts.PULSE_RATE);
  const reducedUrinaryOutput = filterObservations(
    obs,
    concepts.REDUCED_URINARY_OUTPUT
  );
  const clammyPeripherals = filterObservations(obs, concepts.CAPILLARY_REFILL);
  const hemorrhage = filterObservations(obs, concepts.HEMORRHAGE);
  const dehydration = filterObservations(obs, concepts.DEHYDRATION_SKIN);
  const heartRate5060 = filterObservations(obs, concepts.HEART_RATE_50);
  const temperature3738 = filterObservations(obs, concepts.TEMPERATURE);

  const results = [
    isCirculationAbnormal,
    weakIrregularPulse,
    heartRate,
    pulseRate,
    reducedUrinaryOutput,
    clammyPeripherals,
    hemorrhage,
    dehydration,
    heartRate5060,
    temperature3738,
  ];

  return formatAllObsToObject(results);
};

export const formatAllConsciousness = (obs: Obs[]) => {
  const consciousness = filterObservations(
    obs,
    concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS
  );
  const bloodGlucose = filterObservations(obs, concepts.BLOOD_GLUCOSE);
  const gcs = filterObservations(obs, concepts.GCS);

  const results = [consciousness, bloodGlucose, gcs];

  return formatAllObsToObject(results);
};

export const formatAllPersistentPain = (obs: Obs[]) => {
  const activeSeizures = filterObservations(obs, concepts.ACTIVE_SEIZURES);
  const focalNeurological = filterObservations(
    obs,
    concepts.FOCAL_NEUROLOGICAL
  );
  const headache = filterObservations(obs, concepts.HEADACHE);
  const weakness = filterObservations(obs, concepts.WEAKNESS);
  const confusion = filterObservations(obs, concepts.CONFUSION);
  const severePain = filterObservations(obs, concepts.SEVERE_PAIN);
  const moderatePain = filterObservations(obs, concepts.MODERATE_PAIN);

  const results = [
    activeSeizures,
    focalNeurological,
    headache,
    weakness,
    confusion,
    severePain,
    moderatePain,
  ];

  return formatAllObsToObject(results);
};

const formatAllObsToObject = (results: Array<any>) => {
  let totalNumberOfTriageConducted: number = 0;
  results.forEach((r: any) => {
    totalNumberOfTriageConducted =
      r.length > totalNumberOfTriageConducted
        ? r?.length
        : totalNumberOfTriageConducted;
  });

  let formattedTriageResults: any = {};

  for (let i = 0; i < totalNumberOfTriageConducted; i++) {
    const formattedVitals: any = [];
    results.forEach((result) => {
      if (result) formattedVitals.push(result[i]);
    });
    formattedTriageResults[i] = formattedVitals;
  }

  return formattedTriageResults;
};

export const filterObservations = (obs: Obs[], name: string): Obs[] | null => {
  if (!obs) {
    return null;
  }
  return obs
    .filter((ob: any) => {
      return ob.names.find(
        (n: any) => n.name.toLowerCase() == name.toLowerCase()
      );
    })
    .sort((a: Obs, b: Obs) =>
      dayjs(a?.obs_datetime).isBefore(dayjs(b?.obs_datetime)) ? -1 : 1
    );
};

export const getPatientId = (patientIdentifiers: Identifier[]) => {
  if (!patientIdentifiers) return "";

  const identifiers = patientIdentifiers.find(
    (ide) => ide?.identifier_type?.name == "National id"
  );

  if (!identifiers) return "";

  return identifiers.identifier;
};
