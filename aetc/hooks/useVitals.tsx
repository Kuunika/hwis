import { encounters, concepts } from "@/constants";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";
import { formatAllVitalsToObject, getObservationValue } from "@/helpers/emr";
import { useContext, useEffect, useState } from "react";
import { getPatientsEncounters } from "./encounter";
import { getActivePatientDetails } from "./getActivePatientDetails";

export const useVitals = () => {
  const { patientId, activeVisitId } = getActivePatientDetails();

  const { data, isLoading } = getPatientsEncounters(patientId as string);
  const [vitals, setVitals] = useState<any>([]);
  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [options, setOptions] = useState<Array<any>>([]);
  const [activePage, setActivePage] = useState<number>(0);

  useEffect(() => {
    updateVitals(
      Object.keys(formattedVitals).length > 0 ? formattedVitals[activePage] : []
    );
  }, [activePage]);

  useEffect(() => {
    setOptions(
      Object.keys(formattedVitals).map((key) => ({
        value: Number(key),
        label: `Triage ${Number(key) + 1}`,
      }))
    );
    updateVitals(
      Object.keys(formattedVitals).length > 0 ? formattedVitals[activePage] : []
    );
  }, [formattedVitals]);

  useEffect(() => {
    if (data && activeVisitId !== 0) {
      const encounter = data
        .filter((d) => d?.encounter_type?.uuid == encounters.VITALS)
        .find((d) => d.visit_id == activeVisitId);
      const obs = encounter?.obs ?? [];

      setFormattedVitals(formatAllVitalsToObject(obs));
    }
  }, [activeVisitId, data]);

  const updateVitals = (obs: any) => {
    const saturationRate = getObservationValue(obs, concepts.SATURATION_RATE);
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
        name: "Oxygen Saturation ",
        value: saturationRate ? saturationRate + "%" : "",
      },

      {
        name: "Heart Rate",
        value: heartRate ? heartRate + " bpm" : "",
      },
      {
        name: "Blood Pressure",
        value: systolic ? `${systolic}/${diastolic} mmHg` : "",
      },
      {
        name: "Respiratory Rate",
        value: respiratoryRate ? respiratoryRate + "bpm" : "",
      },
      {
        name: "Temperature",
        value: temperature ? temperature + "°C" : "",
      },
      {
        name: "Glucose",
        value: glucose ? glucose + " mg/dL" : "",
      },
      {
        name: "AVPU",
        value: avpu ? avpu : "",
      },
    ];

    setVitals(initialVitals);
  };

  return { setActivePage, options, vitals, isLoading };
};
