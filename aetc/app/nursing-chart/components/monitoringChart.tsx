"use client";
import { FormContainer } from "@/components";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { Box } from "@mui/material";
import React from "react";

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
        {value === index && <Box sx={{ p: 3, borderRadius: "5px" }}>{children}</Box>}
      </div>
    );
  }

function MonitoringChart() {
    const [value, setValue] = React.useState(0);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };
    
  return (
    <>
      <Tabs value={value} onChange={handleChange} style={{ marginTop: "1ch", marginLeft: "5px" }}>
          <Tab style={{
            borderTopLeftRadius: '4px',
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 0 ? '#ffffff' : 'transparent',
            fontWeight: value === 0 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRight: 'none'
          }} label="Observations">
          </Tab>
          <Tab label="Interventions" style={{
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 1 ? '#ffffff' : 'transparent',
            fontWeight: value === 1 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRight: 'none'
          }}>
          </Tab>
          <Tab label="Fluid Balance" style={{
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 2 ? '#ffffff' : 'transparent',
            fontWeight: value === 2 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRight: 'none'
          }}>
          </Tab>
          <Tab label="Medications" style={{
            borderBottomRightRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 3 ? '#ffffff' : 'transparent',
            fontWeight: value === 3 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
          }}>
          </Tab>
        </Tabs>
        <Box style={{
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginLeft: "5px"
        }}>
          <CustomTabPanel value={value} index={0} ></CustomTabPanel>
          <CustomTabPanel value={value} index={1}></CustomTabPanel>
          <CustomTabPanel value={value} index={2}></CustomTabPanel>
          <CustomTabPanel value={value} index={3}></CustomTabPanel>
        </Box>
    </>
  );
}


export default AuthGuard(MonitoringChart, [roles.CLINICIAN, roles.NURSE, roles.ADMIN]);