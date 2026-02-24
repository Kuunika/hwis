import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import {
  ClinicalNotes,
  Investigations,
  Medications,
  Results,
  PatientChart,
  VisitHistory,
  PresentingComplaint,
} from "./panels";
import { DiagnosisTabDisplay } from "./panels/diagnosis";
import { ClinicalNotesUpdated } from "./panels/clinicalNotesUpdated";
import { DrugChart } from "./panels/drugChart";
import { DrugChartWithData } from "./panels/drugChartWithData";

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
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
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
        width: "100%",
        mt: 2,
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          borderRadius: "4px 4px 0 0",
          marginRight: "2px",
          borderBottom: "none",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            overflow: "scroll",
            width: "100%", // Ensure tabs fill the entire container width
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-evenly",
              overflow: "scroll", // Ensure tabs are spaced evenly
            },
          }}
        >
          <Tab
            label="Monitoring Chart"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 0 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 0 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
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
              background: value === 1 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 1 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          <Tab
            label="Investigations"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 2 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 2 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
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
              background: value === 3 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 3 ? "bold" : "normal",
              borderBottom: "none",
            }}
          />
          <Tab
            label="Results"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 4 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 4 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          <Tab
            label="Diagnosis"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 5 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 5 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          {/* <Tab
            label="Dispensation"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 6 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 6 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          /> */}
          <Tab
            label="Visit History"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 6 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 6 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          />
          {/* <Tab
            label="Presenting Complaint"
            sx={{
              flexGrow: 1,
              textTransform: "none",
              padding: "12px",
              background: value === 4 ? "#DDEEDD" : "#FFFFFF",
              fontWeight: value === 4 ? "bold" : "normal",
              borderBottom: "none",
              marginRight: "2px",
              borderRight: "none",
              "&:last-child": {
                borderRight: "1px solid #ccc",
              },
            }}
          /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PatientChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <ClinicalNotes /> */}
        <ClinicalNotesUpdated />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Investigations />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Medications />
        {/* <DrugChart /> */}
        {/* <DrugChartDemo /> */}
        {/* <DrugChartWithData /> */}
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={4}>
        <PresentingComplaint />
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={4}>
        <Results />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <DiagnosisTabDisplay />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={6}>
        <>dispendation</>
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={6}>
        <VisitHistory />
      </CustomTabPanel>
    </Box>
  );
};
