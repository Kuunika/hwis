'use client';
import { MainButton, MainGrid, MainTypography, WrapperBox } from "@/components";
import { ConsultationCard, PersonalDetailsCard } from ".";
import {
  BasicAccordion,
  ClinicalNotes,
  Investigations,
  Medications,
  Results,
  aetcClecking,
  templateForms,
} from "./panels";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PersonalDetailsTabletView } from "./cards/patientDetailsTabletView";
import { VitalsPanel } from "./panels/vitalsDetails";
import { BasicSelect } from "./basicSelect";
import { FaFileAlt } from "react-icons/fa";
import { checkPatientIfOnWaitingAssessment, useParameters } from "@/hooks";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from "@mui/material";




 
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string)
  
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  return (
    <MainGrid
      display={{ xs: "none", lg: "flex" }}
      container
      spacing={1}
      mt={"2ch"}
      ml={"9ch"}
  
    >
      <MainGrid item lg={2}>
        <PersonalDetailsCard />
        <WrapperBox sx={{ my: "1ch" }}>
          <ConsultationCard
            disabled={!isOnList}
            link={"/primary-assessment/" + params.id}
            title="Start Primary Survey"
          />
          <ConsultationCard
            disabled={!isOnList}
            link="/primary-assessment"
            title="Start Secondary Survey"
          />
        </WrapperBox>
        <BasicAccordion />
      </MainGrid>
      <MainGrid item lg={9}>
      <VitalsPanel />
      <WrapperBox sx={{ display: "flex", gap: "1ch" }}>
        <div style={{ flex: 1,
          backgroundColor: '#f0f0f0', // Light grey background for placeholders
          height: '300px', // Height of the graph placeholders
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc'}}>
          <p>Graph 1 Placeholder</p>
        </div>
        <div style={{ flex: 1,
          backgroundColor: '#f0f0f0', // Light grey background for placeholders
          height: '300px', // Height of the graph placeholders
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc'}}>
          <p>Graph 2 Placeholder</p>
        </div>
      </WrapperBox>
<br/>

      <Tabs value = {value} onChange={handleChange} style={{
    backgroundColor: '#f0f0f0',  // Background color of the tabs
    borderRadius: '4px',         // Rounded corners
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)'  // Drop shadow for depth
  }}>
          <Tab style={{
      borderTopLeftRadius: '4px',
      padding: '10px 20px',       // Padding inside the tab
      minWidth: '120px',          // Minimum width of the tab
      background: value === 0 ? '#ffffff' : 'transparent',  // Active tab background color
      fontWeight: value === 0 ? 'bold' : 'normal',          // Active tab font weight
      border: '1px solid #ggg',   // Border for inactive tabs
      borderRight: 'none'         // No right border for the first tab
    }} label="Investigations"> 
            </Tab>
            <Tab label="Clinical Notes" style={{
      padding: '10px 20px',
      minWidth: '120px',
      background: value === 1 ? '#ffffff' : 'transparent',
      fontWeight: value === 1 ? 'bold' : 'normal',
      border: '1px solid #ccc',
      borderRight: 'none'
    }}>  
              </Tab>
              <Tab label="Results" style={{
      padding: '10px 20px',
      minWidth: '120px',
      background: value === 2 ? '#ffffff' : 'transparent',
      fontWeight: value === 2 ? 'bold' : 'normal',
      border: '1px solid #ccc',
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
      border: '1px solid #ccc'
    }}>
              
              </Tab>
   
              
              
              
        </Tabs>
        <Box style={{
    backgroundColor: '#ffffff',  // Background color of the tabs
    borderRadius: '4px',         // Rounded corners
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)'  // Drop shadow for depth
  }} >
        <CustomTabPanel value={value} index={0}><Investigations /></CustomTabPanel>
<CustomTabPanel value={value} index={1}><ClinicalNotes /></CustomTabPanel>
<CustomTabPanel value={value} index={2}><Results /></CustomTabPanel>
<CustomTabPanel value={value} index={3}><Medications /></CustomTabPanel>  
</Box>
      </MainGrid>
    </MainGrid>
  );
};

export const TabletView = () => {
  const visits = [
    { value: "1", label: "Current" },
    { value: "2", label: "12 January 2024" },
    { value: "3", label: "15 December 2023" },
  ];
  return (
    <MainGrid display={{ xs: "block", lg: "none" }} container>
      <MainGrid item xs={12} sx={{ ml: "0.5ch", mt: "2ch", p: "1ch" }}>
        <WrapperBox display="flex">
          <ActionMenu />{" "}
          <WrapperBox sx={{ width: "15ch", mx: "1ch" }}>
            <BasicSelect label="Visits" options={visits} />
          </WrapperBox>
        </WrapperBox>
      </MainGrid>
      <MainGrid item xs={12} sx={{ p: "1ch" }}>
        <WrapperBox sx={{ display: "flex" }}>
          <PersonalDetailsTabletView />
          <VitalsPanel />
        </WrapperBox>
        <WrapperBox sx={{ display: "flex" }}>
          <ClinicalNotes />
          <Investigations />
        </WrapperBox>
        <WrapperBox sx={{ display: "flex" }}>
          <Medications />
          <Results />
        </WrapperBox>
      </MainGrid>
    </MainGrid>
  );
};

const ActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const forms = [...aetcClecking, ...templateForms];

  return (
    <>
      <MainButton
        icon={<FaFileAlt />}
        aria-controls={open ? "basic-menu" : undefined}
        sx={{ borderRadius: "1px" }}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="secondary"
        onClick={handleClick}
        title={"forms"}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {forms.map(({ link, icon, label }) => {
          return (
            <MenuItem key={label} onClick={handleClose}>
              <Link href={link}>
                <WrapperBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: "1ch",
                    px: "2ch",
                  }}
                >
                  {icon && <Image src={icon} alt="AETC Form icon" />}
                  <MainTypography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: "17px",
                      letterSpacing: "0em",
                      textAlign: "left",
                      my: "0.5ch",
                      ml: "5px",
                    }}
                  >
                    {label}
                  </MainTypography>
                </WrapperBox>
              </Link>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
