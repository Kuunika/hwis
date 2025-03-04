import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Grid, Box, Typography, Paper, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import { useVitalsGraphData } from "@/hooks";

export function BP() {
  const lineChartRef = useRef(null);
  const { chartData } = useVitalsGraphData();
  console.log("🚀 ~ BP ~ chartData:", chartData)
  interface Observation {
    obs_datetime: string;
    [key: string]: any;
  }
  
  const extractTimes = (dates: Date[]): string[] => {
    return dates.map(date => {
      const dateString = date.toString();
      const timePart = dateString.split(' ')[4];
      return timePart;
    });
  };

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
        categories: extractTimes(chartData.xAxisData),
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
      },
      series: [
        {
          name: "Systolic",
          data: chartData.systolicbpData, // Heart rate in bpm, typically 60-100
        },
        {
          name: "Diastolic",
          data: chartData.diastolicbpData, // Blood pressure systolic values (typically ~120)
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
  }, [chartData]);

  return <Box id="line-chart" ref={lineChartRef} sx={{ height: 350 }}></Box>;
}
