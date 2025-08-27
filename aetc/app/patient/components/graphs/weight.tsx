import { AreaChart } from "./areaChart";

export function Weight() {
  return (
    <AreaChart
      chartConfig={{
        series: [
          {
            name: "Height",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
          },
        ],
        xAxisCategories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        color: "#006401",
        height: 350,
        yAxisMin: 0,
        dataLabelsEnabled: false,
      }}
    />
  );
}
