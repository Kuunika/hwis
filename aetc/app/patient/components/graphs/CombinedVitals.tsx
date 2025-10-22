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

  // Merge all unique dates and sort them
  const allDates = [
    ...rrDates,
    ...hrDates,
    ...glucoseDates,
    ...bpDates,
    ...tempDates,
    ...o2Dates,
  ];
  const uniqueDates = Array.from(new Set(allDates)).sort();

  // Function to align data with the unified date array
  const alignData = (values: number[], dates: string[]) => {
    return uniqueDates.map((date) => {
      const index = dates.indexOf(date);
      return index !== -1 ? values[index] : null;
    });
  };

  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Respiratory Rate",
            data: alignData(respiratoryRate, rrDates) as number[],
          },
          {
            name: "Heart Rate",
            data: alignData(heartRate, hrDates) as number[],
          },
          {
            name: "Glucose",
            data: alignData(glucose, glucoseDates) as number[],
          },
          {
            name: "Systolic BP",
            data: alignData(systolic, bpDates) as number[],
          },
          {
            name: "Diastolic BP",
            data: alignData(diastolic, bpDates) as number[],
          },
          {
            name: "Temperature",
            data: alignData(temp, tempDates) as number[],
          },
          {
            name: "O₂ Sat",
            data: alignData(o2Sat, o2Dates) as number[],
          },
        ],
        xAxisCategories: uniqueDates,
        title: "All Vital Signs",
        height: 450,
        yAxisMin: 0,
        showValuesOnPoints: true, // Enable values on every point
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
