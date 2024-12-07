import { encounters, concepts } from "@/constants";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";
import { formatAllVitalsToObject, getObservationValue } from "@/helpers/emr";
import { useContext, useEffect, useState } from "react";
import { getPatientsEncounters } from "./encounter";
import { useNavigation, useParameters } from "./navigation";

export const useVitals = () => {
  const { activeVisit } = useContext(
    PatientProfileContext
  ) as PatientProfileContextType;
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
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
    if (data && activeVisit !== 0) {
      const encounter = data
        .filter((d) => d?.encounter_type.uuid == encounters.VITALS)
        .find((d) => d.visit_id == activeVisit);
      const obs = encounter?.obs ?? [];

      setFormattedVitals(formatAllVitalsToObject(obs));
      // updateVitals(obs);
    }
  }, [activeVisit, data]);

  const updateVitals = (obs: any) => {
    const initialVitals = [
      {
        name: "Oxygen Saturation (%)",
        value: getObservationValue(obs, concepts.OXYGEN_SATURATION),
      },

      {
        name: "Heart Rate (bpm)",
        value: getObservationValue(obs, concepts.HEART_RATE),
      },
      {
        name: "Blood Pressure (mmHg)",
        value: `${getObservationValue(
          obs,
          concepts.BLOOD_PRESSURE_SYSTOLIC
        )}/${getObservationValue(obs, concepts.BLOOD_PRESSURE_DIASTOLIC)}`,
      },
      {
        name: "Respiratory Rate (bpm)",
        value: getObservationValue(obs, concepts.RESPIRATORY_RATE),
      },
      {
        name: "Temperature (°C)",
        value: getObservationValue(obs, concepts.TEMPERATURE),
      },
      {
        name: "Glucose (mg/dL)",
        value: getObservationValue(obs, concepts.GLUCOSE),
      },
      {
        name: "AVPU",
        value: getObservationValue(obs, concepts.AVPU),
      },
    ];
    setVitals(initialVitals);
  };

  return { setActivePage, options, vitals, isLoading };
};
