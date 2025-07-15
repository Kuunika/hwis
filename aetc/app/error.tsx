"use client";

import { useEffect } from "react";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    fetch("/api/log-client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
      }),
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container
          maxWidth="sm"
          sx={{ minHeight: "50vh", display: "flex", alignItems: "center" }}
        >
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: 4, textAlign: "center", width: "100%" }}
          >
            <Box sx={{ mb: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main" }} />
            </Box>
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We’re experiencing a system issue. Our technical team has been
              notified. Please try again, or contact support if the problem
              persists.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => reset()}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Try Again
            </Button>

          
          </Paper>
        </Container>
      </body>
    </html>
  );
}
