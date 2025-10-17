import { Paper, Typography } from "@mui/material";
import React from "react";

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 2,
                "@media print": {
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                },
            }}
            className="no-page-break"
        >
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 1,
                    "@media print": {
                        fontSize: "14px",
                    },
                }}
            >
                {title}
            </Typography>
            {children}
        </Paper>
    );
};
