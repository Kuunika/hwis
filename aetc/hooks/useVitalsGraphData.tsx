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
      const encounter = data
        .filter((d) => d?.encounter_type?.uuid === encounters.VITALS)
        .find((d) => d.visit_id === activeVisitId);
      const obs = encounter?.obs ?? [];

      const formattedVitals = formatAllVitalsToObject(obs);
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

        // Extract relevant data based on concept_id
        const systolicbp =
          obsArray.find((obs: any) => obs?.concept_id === 5085)
            ?.value_numeric || null;
        const diastolicbp =
          obsArray.find((obs: any) => obs?.concept_id === 5086)
            ?.value_numeric || null;
        const heartrate =
          obsArray.find((obs: any) => obs?.concept_id === 5087)
            ?.value_numeric || null;
        const glucose =
          obsArray.find((obs: any) => obs?.concept_id === 887)?.value_text ||
          null;
        const temperature =
          obsArray.find((obs: any) => obs?.concept_id === 5088)
            ?.value_numeric || null;
        const rr =
          obsArray.find((obs: any) => obs?.concept_id === 5242)?.value_text ||
          null;
        const O_2Sat =
          obsArray.find((obs: any) => obs?.concept_id === 5092)?.value_text ||
          null;

        // Extract and format timestamp
        const datetime = new Date(
          obsArray.find((obs: any) => obs?.obs_datetime)?.obs_datetime || ""
        );

        triageData.push({
          timestamp: isNaN(datetime.getTime()) ? null : datetime,
          systolicbp,
          diastolicbp,
          heartrate,
          glucose,
          temperature,
          rr,
          O_2Sat,
        });
      }

      // Sort triage data by timestamp
      triageData.sort(
        (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
      );

      // Map sorted data to chart data arrays
      const xAxisData = triageData.map((data) => data.timestamp);
      const systolicbpData = triageData.map((data) => data.systolicbp);
      const diastolicbpData = triageData.map((data) => data.diastolicbp);
      const heartRateData = triageData.map((data) => data.heartrate);
      const glucoseData = triageData.map((data) => data.glucose);
      const tempData = triageData.map((data) => data.temperature);
      const rrData = triageData.map((data) => data.rr);
      const O_2SatData = triageData.map((data) => data.O_2Sat);

      return {
        xAxisData,
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
