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
import React, { useEffect, useState } from "react";
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
import LineChartComponent from "./lineChart";
import FlowStarter from "./flowStarter";
import { getPatientsEncounters } from "@/hooks/encounter";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";




 
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
      {value === index && <Box sx={{ p: 3, border: "1px solid #E6E6E6", borderRadius: "5px" }}>{children}</Box>}
    </div>
  );
}

export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [value, setValue] = React.useState(0);
  const [chartData, setChartData] = useState({ xAxisData: [], systolicbpData: [], diastolicbpData: [], heartRateData: [], glucoseData: [], tempData: [], rrData: [] });
  const [selectedChartTop, setSelectedChartTop] = useState('bp'); // State for top chart container
  const [selectedChartBottom, setSelectedChartBottom] = useState('glu'); // State for bottom chart container
  const { setActiveVisit, activeVisit, setOpenVisit } = React.useContext(PatientProfileContext) as PatientProfileContextType;
  
  const handleButtonClickTop = (selectedChartType: string) => {
    setSelectedChartTop(selectedChartType);
  };

  const handleButtonClickBottom = (selectedChartType: string) => {
    setSelectedChartBottom(selectedChartType);
  };
  const extractTriages = (obs: any, index = 0, triages: any = []): any => {
    if (index >= obs.length) {
      return triages;
    }

    const triage = {
      systolicbp: obs[index + 3]?.value,
      diastolicbp: obs[index + 4]?.value,
      respiratoryrate: obs[index + 5]?.value,
      temperature: obs[index + 6]?.value,
      glu: obs[index + 7]?.value,
      heartrate: obs[index + 2]?.value,
      triage_datetime: obs[index + 3]?.obs_datetime
    };

    return extractTriages(obs, index + 12, [...triages, triage]);
  };

  const extractVisits = (data: any, index = 6, visits: { triages: any }[] = []): any => {
    if (index >= data.length) {
      return visits;
    }

    const obs = data[index]?.obs;
    if (obs && Array.isArray(obs)) {
      const triages = extractTriages(obs);
      return extractVisits(data, index + 12, [...visits, { triages }]);
    }

    return visits;
  };

  const createPatientObject = (data: any): any => {
    if (!data || !Array.isArray(data)) {
      return null; // Or handle the error as needed
    }

    const visits = extractVisits(data);
    console.log(visits);
    return { visits };
  };

  const activeButtonStyle = {
    backgroundColor: '#007bff',
    color: '#ffffff'
  };


  useEffect(() => {
    
    const extractChartData = (patientObject: any) => {
      const triageData: any[] = [];
      patientObject.visits.forEach((visit: any) => {
        visit.triages.forEach((triage: any) => {
          const datetime = new Date(triage.triage_datetime);

          triageData.push({
            timestamp: isNaN(datetime) ? null : datetime,
            systolicbp: triage.systolicbp,
            diastolicbp: triage.diastolicbp,
            heartrate: triage.heartrate,
            glucose: triage.glu,
            temperature: triage.temperature,
            rr: triage.respiratoryrate
          });
        });
      });

      triageData.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

      const xAxisData = triageData.map(data => data.timestamp);
      const systolicbpData = triageData.map(data => data.systolicbp !== undefined ? data.systolicbp : null);
      const diastolicbpData = triageData.map(data => data.diastolicbp !== undefined ? data.diastolicbp : null);
      const heartRateData = triageData.map(data => data.heartrate !== undefined ? data.heartrate : null);
      const glucoseData = triageData.map(data => data.glucose !== undefined ? data.glucose : null);
      const tempData = triageData.map(data => data.temperature !== undefined ? data.temperature : null);
      const rrData = triageData.map(data => data.rr !== undefined ? data.rr : null);

      return { xAxisData, systolicbpData, diastolicbpData, heartRateData, glucoseData, tempData, rrData };
    };

    
    const patientObject = createPatientObject(data);
    console.log(patientObject);
    if (patientObject) {
      const chartData: any = extractChartData(patientObject);
      console.log(`Active visit: ${activeVisit}`);
      setChartData(chartData);
    }
  }, [data]);

  useEffect(() => {
    setSelectedChartTop(prevTop => prevTop === selectedChartTop ? prevTop : selectedChartTop);
    setSelectedChartBottom(prevBottom => prevBottom === selectedChartBottom ? prevBottom : selectedChartBottom);
  }, [selectedChartBottom, selectedChartTop]);


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
        <WrapperBox sx={{ display: "flex", gap: "1ch", marginTop: "3ch", marginLeft: "0.3ch" }}>
          <div style={{ flex: 1, backgroundColor: '#ffffff', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1ch', paddingTop: '1ch' }}>
              <MainButton title={"BP"} onClick={() => handleButtonClickTop('bp')} sx={{ margin: "0 1ch 0 0", ...(selectedChartTop === 'bp' ? activeButtonStyle : {}), }} />
              <MainButton title={"HeartRate"} onClick={() => handleButtonClickTop('hr')} sx={selectedChartTop === 'hr' ? activeButtonStyle : {}}  />
            </div>
            {selectedChartTop === 'bp' && (
              <LineChartComponent
              key={`top-bp-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: 'systolicbpData', label: 'Systolic BP', color: 'blue' },
                  { key: 'diastolicbpData', label: 'Diastolic BP', color: 'red' }
                ]}
              />
            )}
            {selectedChartTop === 'hr' && (
              <LineChartComponent
              key={`top-hr-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: 'heartRateData', label: 'Heart Rate', color: 'green' }
                ]}
              />
            )}
          </div>
          <div style={{ flex: 1, backgroundColor: '#ffffff', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1ch', paddingTop: '1ch' }}>
              <MainButton title={"Glucose"} onClick={() => handleButtonClickBottom('glu')} sx={{ margin: "0 1ch 0 0" , ...(selectedChartBottom === 'glu' ? activeButtonStyle : {}),}} />
              <MainButton title={"Temp"} onClick={() => handleButtonClickBottom('temp')} sx={{ margin: "0 1ch 0 0", ...(selectedChartBottom === 'temp' ? activeButtonStyle : {}),}}/>
              <MainButton title={"RR"} onClick={() => handleButtonClickBottom('rr')} sx={selectedChartBottom === 'rr' ? activeButtonStyle : {}} />
            </div>
      
              {selectedChartBottom === 'glu' && (
                <LineChartComponent
                key={`bottom-glu-${JSON.stringify(chartData.xAxisData)}`}
                  chartData={chartData}
                  xAxisData={chartData.xAxisData}
                  series={[
                    { key: 'glucoseData', label: 'Glucose', color: 'purple' }
                  ]}
                />
              )}
              {selectedChartBottom === 'temp' && (
                <LineChartComponent
                key={`bottom-temp-${JSON.stringify(chartData.xAxisData)}`}
                  chartData={chartData}
                  xAxisData={chartData.xAxisData}
                  series={[
                    { key: 'tempData', label: 'Temperature', color: 'orange' }
                  ]}
                />
              )}
              {selectedChartBottom === 'rr' && (
                <LineChartComponent
                key={`bottom-rr-${JSON.stringify(chartData.xAxisData)}`}
                  chartData={chartData}
                  xAxisData={chartData.xAxisData}
                  series={[
                    { key: 'rrData', label: 'Respiratory Rate', color: 'cyan' }
                  ]}
                />
              )}
          </div>
        </WrapperBox>
        <br />
        <Tabs value={value} onChange={handleChange} style={{}}>
          <Tab style={{
            borderTopLeftRadius: '4px',
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 0 ? '#ffffff' : 'transparent',
            fontWeight: value === 0 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRight: 'none'
          }} label="Investigations">
          </Tab>
          <Tab label="Clinical Notes" style={{
            padding: '10px 20px',
            minWidth: '120px',
            background: value === 1 ? '#ffffff' : 'transparent',
            fontWeight: value === 1 ? 'bold' : 'normal',
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRight: 'none'
          }}>
          </Tab>
          <Tab label="Results" style={{
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
        }}>
          <CustomTabPanel value={value} index={0} ><Investigations /></CustomTabPanel>
          <CustomTabPanel value={value} index={1}><ClinicalNotes /></CustomTabPanel>
          <CustomTabPanel value={value} index={2}><Results /></CustomTabPanel>
          <CustomTabPanel value={value} index={3}><Medications /></CustomTabPanel>
        </Box>
      </MainGrid>
      <FlowStarter patient={params} />
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
