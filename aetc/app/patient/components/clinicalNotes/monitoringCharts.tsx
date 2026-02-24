import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  BP,
  HeartRate,
  RespiratoryRate,
  Temp,
  O_2Sat,
  Glucose,
} from "../graphs";
import { Pefr } from "@/app/patient/components/graphs/pefr";
import { Urine } from "@/app/patient/components/graphs/urine";

export const MonitoringCharts = () => {
  const charts = [
    { title: "Blood Pressure (BP)", Component: BP },
    { title: "Temperature (°C)", Component: Temp },
    { title: "Heart Rate (bpm)", Component: HeartRate },
    { title: "Respiratory Rate (breaths/min)", Component: RespiratoryRate },
    { title: "Oxygen Saturation (O₂ Sat)", Component: O_2Sat },
    { title: "Glucose (mmol/L)", Component: Glucose },
    { title: "Peak Expiratory Flow Rate (L/min)", Component: Pefr },
    { title: "Urine Dipstick Ketones", Component: Urine },
  ];

  return (
    <>
      <style>
        {`
          /* Compact chart display */
          .monitoring-charts-container .MuiGrid-item {
            padding: 4px !important;
          }

          .monitoring-charts-container .MuiPaper-root {
            padding: 8px !important;
            margin: 0 !important;
          }

          .monitoring-charts-container .chart-section-title {
            font-size: 12px !important;
            font-weight: 600 !important;
            margin-bottom: 4px !important;
          }

          /* Reduce chart heights */
          .monitoring-charts-container .apexcharts-canvas {
            max-height: 120px !important;
          }

          .monitoring-charts-container svg {
            max-height: 120px !important;
          }

          @media print {
            .monitoring-charts-container .MuiGrid-item {
              padding: 2mm !important;
              margin: 0 !important;
            }

            .monitoring-charts-container .MuiPaper-root {
              padding: 2mm !important;
              margin: 0 0 2mm 0 !important;
              border: 0.3pt solid #ccc !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: block !important;
            }

            .monitoring-charts-container .chart-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: block !important;
              position: relative;
            }

            .monitoring-charts-container .chart-section-title {
              font-size: 10px !important;
              font-weight: 600 !important;
              margin-bottom: 1mm !important;
              color: #000 !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            .monitoring-charts-container .apexcharts-canvas {
              height: auto !important;
              max-height: 40mm !important;
            }

            .monitoring-charts-container .apexcharts-graphical {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            @page {
              margin: 10mm !important;
            }
          }
        `}
      </style>

      <Box className="monitoring-charts-container">
        <Grid container spacing={1}>
          {charts.map(({ title, Component }) => (
            <Grid item xs={6} md={3} key={title} className="chart-section">
              <Paper elevation={1} sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="chart-section-title"
                  sx={{ mb: 0.5, fontSize: "0.75rem" }}
                >
                  {title}
                </Typography>
                <Box sx={{ height: "120px", overflow: "hidden" }}>
                  <Component />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

