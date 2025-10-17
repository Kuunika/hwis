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
}

interface LineChartProps extends BoxProps {
  chartConfig: ChartConfig;
}

export const LineChart: React.FC<LineChartProps> = ({
  chartConfig,
  ...boxProps
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
    const effectiveHeight =
        chartConfig.series.some((s) => s.data?.length > 0)
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
          dashArray: [0, 5],

      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "10px",
          fontWeight: "bold",
        },
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
