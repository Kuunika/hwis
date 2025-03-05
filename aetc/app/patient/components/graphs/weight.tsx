import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Grid, Box, Typography, Paper, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";

export function Weight() {
  const areaChartRef = useRef(null);

  // Initialize area chart
  useEffect(() => {
    // Define area chart options
    const areaChartOptions = {
      chart: {
        id: "vital-signs-area-chart",
        type: "area",
        height: 350,
      },
      fill: {
        colors: ["#006401"],
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
        colors: ["#006401"],
        width: 2,
      },
      markers: {
        size: 3,
        colors: ["#006401"],
        strokeColors: ["#006401"],
        hover: {
          size: 5,
          sizeOffset: 3,
        },
      },
      dataLabels: {
        enabled: false,
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
        row: {
          colors: "",
          opacity: 0.5,
        },
        column: {
          colors: "",
          opacity: 0.5,
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
      },
      series: [
        {
          name: "Vital Signs",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
      ],
    };

    let areaChart;
    if (areaChartRef.current) {
      areaChart = new ApexCharts(areaChartRef.current, areaChartOptions);
      areaChart.render();
    }

    // Clean up area chart
    return () => {
      if (areaChart) {
        areaChart.destroy();
      }
    };
  }, []);

  return <Box id="area-chart" ref={areaChartRef} sx={{ height: 350 }}></Box>;
}
