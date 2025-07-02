import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function BP() {
  const { values: systolic, dateTimes: systolicDates } = getObsGraphData(
    "Systolic blood pressure"
  );
  const { values: diastolic, dateTimes: diastolicDates } = getObsGraphData(
    "Diastolic blood pressure"
  );
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Systolic",
            data: systolic,
          },
          {
            name: "Diastolic",
            data: diastolic,
          },
        ],
        xAxisCategories: systolicDates,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#FF1654", "#247BA0"],
      }}
    />
  );
}
