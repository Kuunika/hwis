import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
import { extractDateTime } from "@/helpers/dateTime";
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
        xAxisCategories: extractDateTime(chartData.datetimeSystolicbp),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#FF1654", "#247BA0"],
      }}
    />
  );
}
