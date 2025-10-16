// components/clinicalNotes/MonitoringCharts.tsx
import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
    BP,
    HeartRate,
    RespiratoryRate,
    Temp,
    O_2Sat,
    Glucose,
} from "../graphs";

export const MonitoringCharts = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Blood Pressure (BP)
                    </Typography>
                    <BP />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Temperature (°C)
                    </Typography>
                    <Temp />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Heart Rate (bpm)
                    </Typography>
                    <HeartRate />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Respiratory Rate (breaths/min)
                    </Typography>
                    <RespiratoryRate />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Oxygen Saturation (O₂ Sat)
                    </Typography>
                    <O_2Sat />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Glucose (mmol/L)
                    </Typography>
                    <Glucose />
                </Paper>
            </Grid>
        </Grid>
    );
};
