import { encounters, concepts } from "@/constants";
import { formatAllVitalsToObject, getObservationValue } from "@/helpers/emr";
import { use, useEffect, useState } from "react";
import { getPatientsEncounters } from "./encounter";
import { getActivePatientDetails } from "./getActivePatientDetails";
import { useVisitDates } from "@/contexts/visitDatesContext";
import { getObsGraphData } from "./useVitalsGraphData";
import { getAllObservations } from "./obs";

export const useVitals = () => {
  const { patientId } = getActivePatientDetails();
  const { visitDate } = useVisitDates();
  const { data, isLoading } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.VITALS}`
  );
  const [vitals, setVitals] = useState<any>([]);
  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [options, setOptions] = useState<Array<any>>([]);
  const [activePage, setActivePage] = useState<number>(0);
  const { data: heartRateData } = getAllObservations(
    patientId,
    concepts.HEART_RATE
  );
  const { data: respiratoryRateData } = getAllObservations(
    patientId,
    concepts.RESPIRATORY_RATE
  );
  const { data: saturationData } = getAllObservations(
    patientId,
    concepts.BLOOD_OXYGEN_SATURATION
  );
  const { data: temperatureData } = getAllObservations(
    patientId,
    concepts.TEMPERATURE
  );
  const { data: glucoseData } = getAllObservations(patientId, concepts.GLUCOSE);
  const { data: avpuData } = getAllObservations(patientId, concepts.AVPU);
  const { data: systolicData } = getAllObservations(
    patientId,
    concepts.SYSTOLIC_BLOOD_PRESSURE
  );
  const { data: diastolicData } = getAllObservations(
    patientId,
    concepts.DIASTOLIC_BLOOD_PRESSURE
  );

  const getLatestValue = (obsData: any) => {
    if (!obsData?.data?.length) return null;
    return (
      obsData.data.reduce((latest: any, current: any) =>
        new Date(current.obs_datetime) > new Date(latest.obs_datetime)
          ? current
          : latest
      )?.value || null
    );
  };

  useEffect(() => {
    const saturationRate = getLatestValue(saturationData);
    const heartRate = getLatestValue(heartRateData);
    const respiratoryRate = getLatestValue(respiratoryRateData);
    const temperature = getLatestValue(temperatureData);
    const glucose = getLatestValue(glucoseData);
    const avpu = getLatestValue(avpuData);
    const systolic = getLatestValue(systolicData);
    const diastolic = getLatestValue(diastolicData);

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
        value: systolic && diastolic ? `${systolic}/${diastolic} mmHg` : "",
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
        value: glucose ? `${glucose}` : "",
      },
      {
        name: "AVPU",
        value: avpu || "",
      },
    ];

    setVitals(initialVitals);
  }, [
    heartRateData,
    respiratoryRateData,
    saturationData,
    temperatureData,
    glucoseData,
    avpuData,
    systolicData,
    diastolicData,
  ]);

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

  return { setActivePage, options, vitals, isLoading };
};
