import { useVitalsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function HeartRate() {
  const { chartData } = useVitalsGraphData();

  const extractTimes = (dates: Date[]): string[] => {
    return dates.map((date) => {
      const dateString = date.toString();
      const timePart = dateString.split(" ")[4];
      return timePart;
    });
  };

  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Heart Rate",
            data: chartData.heartRateData,
          },
        ],
        xAxisCategories: extractTimes(chartData.xAxisData),
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#70C1B3"],
      }}
    />
  );
}
