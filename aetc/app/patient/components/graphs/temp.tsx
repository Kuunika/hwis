import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function Temp() {
  const { values, dateTimes } = getObsGraphData("Temperature");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Temperature",
            data: values,
          },
        ],
        xAxisCategories: dateTimes,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#8C54FF"],
      }}
    />
  );
}
