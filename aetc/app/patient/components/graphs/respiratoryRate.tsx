import { extractDateTime } from "@/helpers/dateTime";
import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function RespiratoryRate() {
  const { chartData } = useVitalsGraphData();
  console.log("🚀 ~ RespiratoryRate ~ chartData:", chartData.datetimeRR);
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Respiratory Rate",
            data: chartData.rrData,
          },
        ],
        xAxisCategories: extractDateTime(chartData.datetimeRR),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#d815a7"],
      }}
    />
  );
}
