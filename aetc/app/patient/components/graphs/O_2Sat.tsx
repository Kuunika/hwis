import { extractDateTime } from "@/helpers/dateTime";
import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function O_2Sat() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "O₂ Sat",
            data: chartData.O_2SatData,
          },
        ],
        xAxisCategories: extractDateTime(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#F3A712"],
      }}
    />
  );
}
