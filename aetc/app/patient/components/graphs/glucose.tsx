import { getObsGraphData } from "@/hooks";
import { LineChart } from "./lineChart";
export function Glucose() {
  const { values, dateTimes } = getObsGraphData("Serum glucose");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "Glucose",
            data: values,
          },
        ],
        xAxisCategories: dateTimes,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#247BA0"],
      }}
    />
  );
}
