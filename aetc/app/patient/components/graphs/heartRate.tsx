import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function HeartRate() {
  const { values, dateTimes } = getObsGraphData("Heart Rate");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Heart Rate",
            data: values,
          },
        ],
        xAxisCategories: dateTimes,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#70C1B3"],
      }}
    />
  );
}
