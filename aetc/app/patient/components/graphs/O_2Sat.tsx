import { extractDateTime } from "@/helpers/dateTime";
import { LineChart } from "./lineChart";
import { getObsGraphData } from "@/hooks";
export function O_2Sat() {
  const { values, dateTimes } = getObsGraphData("Blood oxygen saturation");
  return (
    <LineChart
      chartConfig={{
        series: [
          {
            name: "O₂ Sat",
            data: values,
          },
        ],
        xAxisCategories: dateTimes,
        title: "",
        height: 350,
        yAxisMin: 0,
        colors: ["#F3A712"],
      }}
    />
  );
}
