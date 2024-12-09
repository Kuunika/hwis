import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ClinicalNotes, Investigations, Medications, Results } from "./panels";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, borderRadius: "5px" }}>{children}</Box>
      )}
    </div>
  );
}

export const TabsContainer = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          borderRadius: "4px 4px 0 0",
          // border: "1px solid #ccc",
          borderBottom: "none",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            width: "100%", // Ensure tabs fill the entire container width
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-evenly", // Ensure tabs are spaced evenly
            },
          }}
        >
          <Tab
            label="Investigations"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 0 ? "#ffffff" : "transparent",
              fontWeight: value === 0 ? "bold" : "normal",
              borderBottom: "none",
              border: "1px solid #ccc",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          <Tab
            label="Clinical Notes"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 1 ? "#ffffff" : "transparent",
              fontWeight: value === 1 ? "bold" : "normal",
              borderBottom: "none",
              border: "1px solid #ccc",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          <Tab
            label="Results"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 2 ? "#ffffff" : "transparent",
              fontWeight: value === 2 ? "bold" : "normal",
              borderBottom: "none",
              border: "1px solid #ccc",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          <Tab
            label="Medications"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 3 ? "#ffffff" : "transparent",
              fontWeight: value === 3 ? "bold" : "normal",
              borderBottom: "none",
              border: "1px solid #ccc",
            }}
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "0 0 4px 4px",
          border: "1px solid #ccc",
        }}
      >
        <CustomTabPanel value={value} index={0}>
          <Investigations />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ClinicalNotes />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Results />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Medications />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};
