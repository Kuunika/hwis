import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Grid, Box, Typography, Paper, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";

export function BP() {
  const lineChartRef = useRef(null);

  // Initialize line chart in a separate useEffect
  useEffect(() => {
    // Define line chart options
    const lineChartOptions = {
      chart: {
        id: "vuechart-example",
        type: "line",
        height: 350,
      },
      stroke: {
        curve: "straight",
        width: 3,
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        textAnchor: "middle",
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "10px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: undefined,
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#fff",
          opacity: 0.9,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
      colors: ["#FF1654", "#247BA0"],
      xaxis: {
        categories: [
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
        ],
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
      },
      series: [
        {
          name: "Systolic",
          data: [72, 75, 78, 70, 68, 80, 74, 73, 76], // Heart rate in bpm, typically 60-100
        },
        {
          name: "Diastolic",
          data: [120, 125, 118, 122, 110, 115, 117, 123, 121], // Blood pressure systolic values (typically ~120)
        },
      ],
    };

    let lineChart;
    if (lineChartRef.current) {
      lineChart = new ApexCharts(lineChartRef.current, lineChartOptions);
      lineChart.render();
    }

    // Clean up line chart
    return () => {
      if (lineChart) {
        lineChart.destroy();
      }
    };
  }, []);

  return <Box id="line-chart" ref={lineChartRef} sx={{ height: 350 }}></Box>;
}
