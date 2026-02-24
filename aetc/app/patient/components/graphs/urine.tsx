import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function Urine() {
  const { values, dateTimes } = getObsGraphData("Urine Dipstick Ketones");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Urine Dipstick Ketones",
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
