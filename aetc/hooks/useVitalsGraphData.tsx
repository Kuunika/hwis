"use client";
import { encounters } from "@/constants";
import { formatAllVitalsToObject } from "@/helpers/emr";
import { useState, useEffect } from "react";
import { getPatientsEncounters } from "./encounter";
import { getActivePatientDetails } from "./getActivePatientDetails";

export const useVitalsGraphData = () => {
  const { activeVisitId } = getActivePatientDetails();
  const { patientId } = getActivePatientDetails();
  const { data, isLoading } = getPatientsEncounters(patientId as string);
  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData, setChartData] = useState<any>({
    xAxisData: [],
    systolicbpData: [],
    diastolicbpData: [],
    heartRateData: [],
    glucoseData: [],
    tempData: [],
    rrData: [],
    O_2Sat: [],
  });

  const [selectedChartTop, setSelectedChartTop] = useState("bp"); // State for top chart container
  const [selectedChartBottom, setSelectedChartBottom] = useState("glu");

  useEffect(() => {
    if (data && activeVisitId !== 0) {
      const filteredEncounters = data.filter(
        (d) => d?.encounter_type?.uuid === encounters.VITALS
      );

      // Collect all obs from different encounters into a single array
      const allObs = filteredEncounters.reduce(
        (accumulator: any, encounter) => {
          if (encounter?.obs && Array.isArray(encounter.obs)) {
            return [...accumulator, ...encounter.obs];
          }
          return accumulator;
        },
        []
      );

      const formattedVitals = formatAllVitalsToObject(allObs);
      setFormattedVitals(formattedVitals);
    }
  }, [activeVisitId, data]);

  useEffect(() => {
    // Function to extract chart data
    const extractChartData = (triages: any[]) => {
      setChartLoading(true);
      const triageData: any[] = [];

      for (const observations of triages) {
        // Ensure observations is an array or convert to array
        const obsArray = Array.isArray(observations)
          ? observations
          : [observations];
        if (!obsArray || !Array.isArray(obsArray)) {
          console.warn("Expected array but got:", obsArray);
          continue; // Skip this triage if it's not an array
        }

        // Define mapping of concept IDs to their respective field names
        const conceptMapping = {
          5085: {
            value: "systolicbp",
            dateField: "datetimeSystolicbp",
            numeric: true,
          },
          5086: {
            value: "diastolicbp",
            dateField: "datetimeDiastolicbp",
            numeric: true,
          },
          5087: {
            value: "heartrate",
            dateField: "datetimeHeartrate",
            numeric: true,
          },
          887: {
            value: "glucose",
            dateField: "datetimeGlucose",
            numeric: false,
          },
          5088: {
            value: "temperature",
            dateField: "datetimeTemperature",
            numeric: true,
          },
          5242: { value: "rr", dateField: "datetimeRR", numeric: false },
          5092: { value: "O_2Sat", dateField: "datetimeO2Sat", numeric: false },
        };

        // Initialize an object to store the triage data
        const triageEntry: any = {};

        // Extract values and dates for each concept
        for (const [conceptId, config] of Object.entries(conceptMapping)) {
          const observation = obsArray.find(
            (obs: any) => obs?.concept_id === parseInt(conceptId)
          );

          if (observation) {
            // Get value based on whether it's numeric or text
            triageEntry[config.value] = config.numeric
              ? observation.value_numeric || null
              : observation.value_text || null;

            // Extract date
            triageEntry[config.dateField] = observation.obs_datetime
              ? observation.obs_datetime
              : null;
          } else {
            triageEntry[config.value] = null;
            triageEntry[config.dateField] = null;
          }
        }

        triageData.push(triageEntry);
      }

      // Sort triage data by timestamp
      triageData.sort(
        (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
      );
      // Map sorted data to chart data arrays
      const datetimeSystolicbp = triageData.map(
        (data) => data.datetimeSystolicbp
      );
      const datetimeDiastolicbp = triageData.map(
        (data) => data.datetimeDiastolicbp
      );
      const datetimeHeartrate = triageData.map(
        (data) => data.datetimeHeartrate
      );
      const datetimeGlucose = triageData.map((data) => data.datetimeGlucose);
      const datetimeTemperature = triageData.map(
        (data) => data.datetimeTemperature
      );
      const datetimeRR = triageData.map((data) => data.datetimeRR);
      const datetimeO2Sat = triageData.map((data) => data.datetimeO2Sat);
      const systolicbpData = triageData.map((data) => data.systolicbp);
      const diastolicbpData = triageData.map((data) => data.diastolicbp);
      const heartRateData = triageData.map((data) => data.heartrate);
      const glucoseData = triageData.map((data) => data.glucose);
      const tempData = triageData.map((data) => data.temperature);
      const rrData = triageData.map((data) => data.rr);
      const O_2SatData = triageData.map((data) => data.O_2Sat);

      return {
        datetimeSystolicbp,
        datetimeDiastolicbp,
        datetimeHeartrate,
        datetimeGlucose,
        datetimeTemperature,
        datetimeRR,
        datetimeO2Sat,
        systolicbpData,
        diastolicbpData,
        heartRateData,
        glucoseData,
        tempData,
        rrData,
        O_2SatData,
      };
    };

    // Extract chart data from formattedVitals

    if (
      formattedVitals &&
      typeof formattedVitals === "object" &&
      Object.keys(formattedVitals).length > 0
    ) {
      const allTriages = Object.values(formattedVitals);
      const chartData = extractChartData(allTriages);
      setChartData(chartData);
      setChartLoading(false);
    } else {
      console.warn(
        "Formatted vitals data is empty, undefined, or not in expected format."
      );
      setChartLoading(false);
    }
  }, [formattedVitals]);

  useEffect(() => {
    setSelectedChartTop((prevTop) =>
      prevTop === selectedChartTop ? prevTop : selectedChartTop
    );
    setSelectedChartBottom((prevBottom) =>
      prevBottom === selectedChartBottom ? prevBottom : selectedChartBottom
    );
  }, [selectedChartBottom, selectedChartTop]);

  return {
    setSelectedChartTop,
    setSelectedChartBottom,
    chartLoading,
    isLoading,
    selectedChartTop,
    chartData,
    selectedChartBottom,
  };
};
