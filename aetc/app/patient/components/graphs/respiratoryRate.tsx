import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";

export function RespiratoryRate() {
  const { values, dateTimes } = getObsGraphData("Respiratory Rate");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Respiratory Rate",
            data: values,
          },
        ],
        xAxisCategories: dateTimes,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#d815a7"],
      }}
    />
  );
}
