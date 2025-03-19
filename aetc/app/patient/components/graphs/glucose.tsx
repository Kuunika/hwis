import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
import { extractDateTime } from "@/helpers/dateTime";
export function Glucose() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Glucose",
            data: chartData.glucoseData,
          },
        ],
        xAxisCategories: extractDateTime(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#247BA0"],
      }}
    />
  );
}
