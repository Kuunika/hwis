import { extractDateTime } from "@/helpers/dateTime";
import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function Temp() {
  const { chartData } = useVitalsGraphData();
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Temperature",
            data: chartData.tempData,
          },
        ],
        xAxisCategories: extractDateTime(chartData.datetimeTemperature),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#8C54FF"],
      }}
    />
  );
}
