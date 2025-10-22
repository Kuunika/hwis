import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Box, BoxProps } from "@mui/material";

// Define interfaces for chart configuration
interface SeriesData {
  name: string;
  data: number[];
  dashStyle?: "Solid" | "Dash" | "Dot";
}

interface ChartConfig {
  series: SeriesData[];
  xAxisCategories: string[];
  title?: string;
  height?: number;
  colors?: string[];
  yAxisMin?: number;
  yAxisMax?: number;
  showLabelsOnLines?: boolean;
  showValuesOnPoints?: boolean;
}

interface LineChartProps extends BoxProps {
  chartConfig: ChartConfig;
}

export const LineChart: React.FC<LineChartProps> = ({
  chartConfig,
  ...boxProps
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const effectiveHeight = chartConfig.series.some((s) => s.data?.length > 0)
    ? chartConfig.height || 350
    : 120;

  useEffect(() => {
    const dashArray = chartConfig.series.map((s) => {
      switch (s.dashStyle) {
        case "Dash":
          return 5;
        case "Dot":
          return 2;
        default:
          return 0;
      }
    });

    const defaultOptions = {
      chart: {
        type: "line",
        height: chartConfig.height || 350,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        dashArray: dashArray,
      },
      dataLabels: {
        enabled:
          chartConfig.showValuesOnPoints ||
          chartConfig.showLabelsOnLines ||
          false,
        enabledOnSeries:
          chartConfig.showValuesOnPoints || chartConfig.showLabelsOnLines
            ? chartConfig.series.map((_, index) => index)
            : undefined,
        formatter: function (val: number, opts: any) {
          const seriesIndex = opts.seriesIndex;
          const dataPointIndex = opts.dataPointIndex;
          const series = chartConfig.series[seriesIndex];
          const seriesName = series.name;

          // Check if it's the last point
          const isLastPoint = dataPointIndex === series.data.length - 1;

          if (chartConfig.showValuesOnPoints && chartConfig.showLabelsOnLines) {
            // Show value at every point, and add series name at the last point
            if (val !== null && val !== undefined) {
              if (isLastPoint) {
                return `${seriesName}\n${val.toFixed(1)}`;
              }
              return val.toFixed(1);
            }
            return "";
          } else if (chartConfig.showValuesOnPoints) {
            // Show only value at every point
            return val !== null && val !== undefined ? val.toFixed(1) : "";
          } else if (chartConfig.showLabelsOnLines) {
            // Show series name only at the last point
            if (isLastPoint) {
              return seriesName;
            }
          }
          return "";
        },
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          colors: chartConfig.colors || ["#FF1654", "#247BA0"],
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          borderRadius: 2,
          padding: 4,
          opacity: 0.9,
        },
        offsetY: -8,
      },
      colors: chartConfig.colors || ["#FF1654", "#247BA0"],
      xaxis: {
        categories: chartConfig.xAxisCategories,
      },
      yaxis: {
        min: chartConfig.yAxisMin,
        max: chartConfig.yAxisMax,
        forceNiceScale: true,
      },
      series: chartConfig.series,
      legend: {
        show: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        y: {
          formatter: function (value: number, { seriesIndex }: any) {
            if (value !== null && value !== undefined) {
              return value.toFixed(2);
            }
            return "N/A";
          },
        },
        x: {
          show: true,
        },
      },
    };

    let chart: ApexCharts;
    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, defaultOptions);
      chart.render();
    }

    // Cleanup
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <Box
      ref={chartRef}
      sx={{ height: chartConfig.height || 350 }}
      {...boxProps}
    />
  );
};
