import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Box, BoxProps } from "@mui/material";

// Define interfaces for area chart configuration
interface SeriesData {
  name: string;
  data: number[];
}

interface AreaChartConfig {
  series: SeriesData[];
  xAxisCategories: string[] | number[];
  title?: string;
  height?: number;
  color?: string;
  yAxisMin?: number;
  yAxisMax?: number;
  dataLabelsEnabled?: boolean;
}

interface AreaChartProps extends BoxProps {
  chartConfig: AreaChartConfig;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  chartConfig,
  ...boxProps
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Default configuration with ability to override
    const defaultOptions = {
      chart: {
        type: "area",
        height: chartConfig.height || 350,
      },
      fill: {
        colors: [chartConfig.color || "#006401"],
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "straight",
        colors: [chartConfig.color || "#006401"],
        width: 2,
      },
      markers: {
        size: 3,
        colors: [chartConfig.color || "#006401"],
        strokeColors: [chartConfig.color || "#006401"],
        hover: {
          size: 5,
          sizeOffset: 3,
        },
      },
      dataLabels: {
        enabled: chartConfig.dataLabelsEnabled || false,
      },
      grid: {
        show: true,
        borderColor: "#B3B3B3",
        strokeDashArray: 4,
        position: "front",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
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
