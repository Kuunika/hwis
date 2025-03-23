import { encounters, concepts } from "@/constants";
import { formatAllVitalsToObject, getObservationValue } from "@/helpers/emr";
import { useEffect, useState } from "react";
import { getPatientsEncounters } from "./encounter";
import { getActivePatientDetails } from "./getActivePatientDetails";
import { useVisitDates } from "@/contexts/visitDatesContext";

export const useVitals = () => {
  const { patientId } = getActivePatientDetails();
  const { visitDate } = useVisitDates();
  const { data, isLoading } = getPatientsEncounters(patientId as string);
  const [vitals, setVitals] = useState<any>([]);
  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [options, setOptions] = useState<Array<any>>([]);
  const [activePage, setActivePage] = useState<number>(0);

  // Update vitals when active page changes
  useEffect(() => {
    updateVitals(
      Object.keys(formattedVitals).length > 0 ? formattedVitals[activePage] : []
    );
  }, [activePage, formattedVitals]);

  useEffect(() => {
    // Reset active page when visit date changes
    setActivePage(0);

    if (data) {
      const filteredEncounters = data.filter((d: any) => {
        return (
          d?.encounter_type?.uuid === encounters.VITALS &&
          d.visit.date_started === visitDate
        );
      });

      const encounter = filteredEncounters[0]; // Get the first matching encounter
      const obs = encounter?.obs ?? [];

      setFormattedVitals(formatAllVitalsToObject(getLatestObservations(obs)));
    }
  }, [visitDate, data]);

  // Update options when formattedVitals changes
  useEffect(() => {
    setOptions(
      Object.keys(formattedVitals).map((key) => ({
        value: Number(key),
        label: `Triage ${Number(key) + 1}`,
      }))
    );
  }, [formattedVitals]);
  const getLatestObservations = (obs: any) => {
    if (!obs || !Array.isArray(obs) || obs.length === 0) {
      return [];
    }

    const latestObsMap = new Map();

    // Find the most recent observation for each concept_id
    obs.forEach((observation: any) => {
      if (
        !observation ||
        !observation.concept_id ||
        !observation.obs_datetime
      ) {
        return; // Skip invalid observations
      }

      const { concept_id, obs_datetime } = observation;
      const currentLatest = latestObsMap.get(concept_id);

      if (
        !currentLatest ||
        new Date(obs_datetime) > new Date(currentLatest.obs_datetime)
      ) {
        latestObsMap.set(concept_id, observation);
      }
    });

    // Convert Map values back to an array
    return Array.from(latestObsMap.values());
  };
  const updateVitals = (obs: any) => {
    const saturationRate = getObservationValue(
      obs,
      concepts.BLOOD_OXYGEN_SATURATION
    );
    const heartRate = getObservationValue(obs, concepts.HEART_RATE);
    const respiratoryRate = getObservationValue(obs, concepts.RESPIRATORY_RATE);
    const temperature = getObservationValue(obs, concepts.TEMPERATURE);
    const glucose = getObservationValue(obs, concepts.GLUCOSE);
    const avpu = getObservationValue(obs, concepts.AVPU);
    const systolic = getObservationValue(obs, concepts.SYSTOLIC_BLOOD_PRESSURE);
    const diastolic = getObservationValue(
      obs,
      concepts.DIASTOLIC_BLOOD_PRESSURE
    );

    const initialVitals = [
      {
        name: "Oxygen Saturation",
        value: saturationRate ? `${saturationRate}%` : "",
      },
      {
        name: "Heart Rate",
        value: heartRate ? `${heartRate} bpm` : "",
      },
      {
        name: "Blood Pressure",
        value: systolic ? `${systolic}/${diastolic} mmHg` : "",
      },
      {
        name: "Respiratory Rate",
        value: respiratoryRate ? `${respiratoryRate} bpm` : "",
      },
      {
        name: "Temperature",
        value: temperature ? `${temperature}°C` : "",
      },
      {
        name: "Glucose",
        value: glucose ? `${glucose} mg/dL` : "",
      },
      {
        name: "AVPU",
        value: avpu || "",
      },
    ];

    setVitals(initialVitals);
  };

  return { setActivePage, options, vitals, isLoading };
};
