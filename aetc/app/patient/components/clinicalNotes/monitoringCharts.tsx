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
          @media print {

            /* Compact layout */
            .MuiGrid-item {
              padding: 2mm !important;
              margin: 0 !important;
            }

            .MuiPaper-root {
              padding: 3mm !important;
              margin: 0 0 4mm 0 !important;
              border: 0.3pt solid #ccc !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: block !important;
            }

            /* Ensure title and chart stay together */
            .chart-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: block !important;
              position: relative;
            }

            /* Typography smaller for print */
            .chart-section-title {
              font-size: 11px !important;
              font-weight: 600 !important;
              margin-bottom: 2mm !important;
              color: #000 !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Charts adapt height */
            .apexcharts-canvas {
              height: auto !important;
              max-height: 60mm !important;
            }

            /* Prevent splitting charts */
            .apexcharts-graphical {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Reduce margins for print */
            @page {
              margin: 10mm !important;
            }
          }
        `}
            </style>

            <Grid container spacing={2}>
                {charts.map(({ title, Component }) => (
                    <Grid item xs={12} md={6} key={title} className="chart-section">
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography
                                variant="subtitle1"
                                className="chart-section-title"
                                sx={{ mb: 1 }}
                            >
                                {title}
                            </Typography>
                            <Component />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
