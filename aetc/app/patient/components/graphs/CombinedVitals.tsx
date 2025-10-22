import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";

export function CombinedVitals() {
  // Get data for all vital signs
  const { values: respiratoryRate, dateTimes: rrDates } =
    getObsGraphData("Respiratory Rate");
  const { values: heartRate, dateTimes: hrDates } =
    getObsGraphData("Heart Rate");
  const { values: glucose, dateTimes: glucoseDates } =
    getObsGraphData("Serum glucose");
  const { values: systolic, dateTimes: bpDates } = getObsGraphData(
    "Systolic blood pressure"
  );
  const { values: diastolic } = getObsGraphData("Diastolic blood pressure");
  const { values: temp, dateTimes: tempDates } = getObsGraphData("Temperature");
  const { values: o2Sat, dateTimes: o2Dates } = getObsGraphData(
    "Blood oxygen saturation"
  );

  // Use the first available dateTimes array
  const xAxisCategories = rrDates.length
    ? rrDates
    : hrDates.length
      ? hrDates
      : bpDates;

  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Respiratory Rate",
            data: respiratoryRate,
          },
          {
            name: "Heart Rate",
            data: heartRate,
          },
          {
            name: "Glucose",
            data: glucose,
          },
          {
            name: "Systolic BP",
            data: systolic,
          },
          {
            name: "Diastolic BP",
            data: diastolic,
          },
          {
            name: "Temperature",
            data: temp,
          },
          {
            name: "O₂ Sat",
            data: o2Sat,
          },
        ],
        xAxisCategories: xAxisCategories,
        title: "All Vital Signs",
        height: 450,
        yAxisMin: 0,
        showLabelsOnLines: true, // Enable labels on lines
        colors: [
          "#d815a7", // Respiratory Rate
          "#70C1B3", // Heart Rate
          "#247BA0", // Glucose
          "#FF1654", // Systolic BP
          "#5B8FA3", // Diastolic BP
          "#8C54FF", // Temperature
          "#F3A712", // O₂ Sat
        ],
      }}
    />
  );
}
