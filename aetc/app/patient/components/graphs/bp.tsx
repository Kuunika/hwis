import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
import { extractTimes } from "@/helpers/dateTime";
export function BP() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Systolic",
            data: chartData.systolicbpData,
          },
          {
            name: "Diastolic",
            data: chartData.diastolicbpData,
          },
        ],
        xAxisCategories: extractTimes(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#FF1654", "#247BA0"],
      }}
    />
  );
}
