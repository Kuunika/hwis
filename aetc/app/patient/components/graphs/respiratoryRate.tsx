import { extractTimes } from "@/helpers/dateTime";
import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function RespiratoryRate() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Respiratory Rate",
            data: chartData.rrData,
          },
        ],
        xAxisCategories: extractTimes(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#d815a7"],
      }}
    />
  );
}
