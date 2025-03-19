import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
import { extractDateTime } from "@/helpers/dateTime";
export function HeartRate() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Heart Rate",
            data: chartData.heartRateData,
          },
        ],
        xAxisCategories: extractDateTime(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#70C1B3"],
      }}
    />
  );
}
