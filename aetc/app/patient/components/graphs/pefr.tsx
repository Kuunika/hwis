import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function Pefr() {
  const { values, dateTimes } = getObsGraphData("Peak Expiratory Flow Rate");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Peak Expiratory Flow Rate",
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
