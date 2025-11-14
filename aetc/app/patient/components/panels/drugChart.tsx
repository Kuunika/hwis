import { useState, useRef } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

export interface Administration {
  time: string;
  initial: string;
}

export interface AdministrationDate {
  date: string;
  initials: Administration[];
}

export interface MedicationRecord {
  date: string;
  medication: {
    name: string;
    dose: string;
    frequency: string;
    route: string;
    prescriber: string;
    stopDate: string;
  };
  administrationDatesAndInitials: AdministrationDate[];
}

interface DrugChartProps {
  medications: MedicationRecord[];
}

export const DrugChart: React.FC<DrugChartProps> = ({ medications }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement && chartRef.current) {
      await chartRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const cellStyle = {
    border: "1px solid #bdbdbd",
    padding: "4px",
    textAlign: "center",
    fontSize: "0.85rem",
  };

  const scrollCellStyle = {
    ...cellStyle,
    minWidth: 120,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* ===== CONTROL BAR ===== */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={handleToggleFullscreen}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ===== TABLE ===== */}
      <Box
        ref={chartRef}
        sx={{
          border: "1px solid #bdbdbd",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "#fff",
          fontSize: "0.85rem",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{ display: "flex", backgroundColor: "#f5f5f5", fontWeight: 600 }}
        >
          <Box sx={{ ...cellStyle, flex: "0 0 8%" }}>Date & Time</Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", flex: "0 0 20%" }}
          >
            <Box sx={{ ...cellStyle, borderBottom: "1px solid #bdbdbd" }}>
              Medication Name
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{ ...cellStyle, flex: 1, borderRight: "1px solid #bdbdbd" }}
              >
                Dose
              </Box>
              <Box sx={{ ...cellStyle, flex: 1 }}>Freq</Box>
            </Box>
          </Box>

          <Box sx={{ ...cellStyle, flex: "0 0 6%" }}>Route</Box>
          <Box sx={{ ...cellStyle, flex: "0 0 8%" }}>Prescriber</Box>
          <Box sx={{ ...cellStyle, flex: "0 0 7%" }}>Stop Date</Box>
          <Box sx={{ ...cellStyle, flex: "0 0 50%" }}>
            Drug Given and Signature
          </Box>
        </Box>

        {/* MEDICATION ROWS */}
        {medications.map((record, idx) => (
          <Box key={idx} sx={{ display: "flex" }}>
            <Box sx={{ ...cellStyle, flex: "0 0 8%" }}>{record.date}</Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", flex: "0 0 20%" }}
            >
              <Box sx={{ ...cellStyle, flex:1 }}>{record.medication.name}</Box>
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    ...cellStyle,
                    flex: 1,
                    borderRight: "1px solid #bdbdbd",
                  }}
                >
                  {record.medication.dose}
                </Box>
                <Box sx={{ ...cellStyle, flex: 1 }}>
                  {record.medication.frequency}
                </Box>
              </Box>
            </Box>

            <Box sx={{ ...cellStyle, flex: "0 0 6%" }}>
              {record.medication.route}
            </Box>
            <Box sx={{ ...cellStyle, flex: "0 0 8%" }}>
              {record.medication.prescriber}
            </Box>
            <Box sx={{ ...cellStyle, flex: "0 0 7%" }}>
              {record.medication.stopDate}
            </Box>

            {/* Drug Given Column */}
            <Box
              sx={{
                flex: "0 0 50%",
                display: "flex",
                overflowX: "auto",
                bgcolor: "#fafafa",
              }}
            >
              {record.administrationDatesAndInitials.map((date) => (
                <Box key={date.date} sx={{ ...scrollCellStyle }}>
                  <Box
                    sx={{ ...cellStyle, fontWeight: 600, bgcolor: "#f0f0f0" }}
                  >
                    {date.date}
                  </Box>
                  {date.initials.map((initial) => (
                    <Box
                      key={initial.time}
                      sx={{
                        ...cellStyle,
                        py: 0.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.7rem", color: "#555" }}>
                        {initial.time}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.7rem" }}>
                        {initial.initial}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
