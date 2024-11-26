"use client";
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
import {
  checkPatientIfOnWaitingAssessment,
  useNavigation,
  useParameters,
} from "@/hooks";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Button } from "@mui/material";
import LineChartComponent from "./lineChart";
import FlowStarter from "./flowStarter";
import { getPatientsEncounters } from "@/hooks/encounter";
import {
  ConsultationContext,
  ConsultationContextType,
  PatientProfileContext,
  PatientProfileContextType,
} from "@/contexts";
import { formatAllVitalsToObject } from "@/helpers/emr";
import { encounters } from "@/constants";
import { OverlayLoader } from "@/components/backdrop";

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

export const DesktopView = () => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [value, setValue] = React.useState(0);
  const [chartData, setChartData] = useState<any>({
    xAxisData: [],
    systolicbpData: [],
    diastolicbpData: [],
    heartRateData: [],
    glucoseData: [],
    tempData: [],
    rrData: [],
  });
  const [selectedChartTop, setSelectedChartTop] = useState("bp"); // State for top chart container
  const [selectedChartBottom, setSelectedChartBottom] = useState("glu"); // State for bottom chart container
  const { activeVisit } = React.useContext(
    PatientProfileContext
  ) as PatientProfileContextType;

  const { setActiveStep } = React.useContext(
    ConsultationContext
  ) as ConsultationContextType;

  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [chartLoading, setChartLoading] = useState(true);
  const handleButtonClickTop = (selectedChartType: string) => {
    setSelectedChartTop(selectedChartType);
  };

  const handleButtonClickBottom = (selectedChartType: string) => {
    setSelectedChartBottom(selectedChartType);
  };

  const inActiveButtonStyle = {
    backgroundColor: "white",
    color: "green",
    border: "1px solid green",
  };

  useEffect(() => {
    if (data && activeVisit !== 0) {
      const encounter = data
        .filter((d) => d?.encounter_type.uuid === encounters.VITALS)
        .find((d) => d.visit_id === activeVisit);
      const obs = encounter?.obs ?? [];

      const formattedVitals = formatAllVitalsToObject(obs);
      setFormattedVitals(formattedVitals);
    }
  }, [activeVisit, data]);

  useEffect(() => {
    // Function to extract chart data
    const extractChartData = (triages: any[]) => {
      setChartLoading(true);
      const triageData: any[] = [];

      for (const observations of triages) {
        // Ensure observations is an array or convert to array
        const obsArray = Array.isArray(observations)
          ? observations
          : [observations];
        if (!obsArray || !Array.isArray(obsArray)) {
          console.warn("Expected array but got:", obsArray);
          continue; // Skip this triage if it's not an array
        }

        // Extract relevant data based on concept_id
        const systolicbp =
          obsArray.find((obs: any) => obs?.concept_id === 5085)
            ?.value_numeric || null;
        const diastolicbp =
          obsArray.find((obs: any) => obs?.concept_id === 5086)
            ?.value_numeric || null;
        const heartrate =
          obsArray.find((obs: any) => obs?.concept_id === 5087)
            ?.value_numeric || null;
        const glucose =
          obsArray.find((obs: any) => obs?.concept_id === 887)?.value_numeric ||
          null;
        const temperature =
          obsArray.find((obs: any) => obs?.concept_id === 5088)
            ?.value_numeric || null;
        const rr =
          obsArray.find((obs: any) => obs?.concept_id === 5242)?.value_text ||
          null;

        // Extract and format timestamp
        const datetime = new Date(
          obsArray.find((obs: any) => obs?.obs_datetime)?.obs_datetime || ""
        );

        triageData.push({
          timestamp: isNaN(datetime.getTime()) ? null : datetime,
          systolicbp,
          diastolicbp,
          heartrate,
          glucose,
          temperature,
          rr,
        });
      }

      // Sort triage data by timestamp
      triageData.sort(
        (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
      );

      // Map sorted data to chart data arrays
      const xAxisData = triageData.map((data) => data.timestamp);
      const systolicbpData = triageData.map((data) => data.systolicbp);
      const diastolicbpData = triageData.map((data) => data.diastolicbp);
      const heartRateData = triageData.map((data) => data.heartrate);
      const glucoseData = triageData.map((data) => data.glucose);
      const tempData = triageData.map((data) => data.temperature);
      const rrData = triageData.map((data) => data.rr);

      return {
        xAxisData,
        systolicbpData,
        diastolicbpData,
        heartRateData,
        glucoseData,
        tempData,
        rrData,
      };
    };

    // Extract chart data from formattedVitals
    if (
      formattedVitals &&
      typeof formattedVitals === "object" &&
      Object.keys(formattedVitals).length > 0
    ) {
      const allTriages = Object.values(formattedVitals);
      const chartData = extractChartData(allTriages);
      setChartData(chartData);
      setChartLoading(false);
    } else {
      console.warn(
        "Formatted vitals data is empty, undefined, or not in expected format."
      );
    }
  }, [formattedVitals]);

  useEffect(() => {
    setSelectedChartTop((prevTop) =>
      prevTop === selectedChartTop ? prevTop : selectedChartTop
    );
    setSelectedChartBottom((prevBottom) =>
      prevBottom === selectedChartBottom ? prevBottom : selectedChartBottom
    );
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
        <OverlayLoader open={isLoading || chartLoading} />
        <WrapperBox sx={{ my: "1ch" }}>
          <ConsultationCard
            disabled={!isOnList}
            title="Assessments"
            links={[
              {
                title: "Primary Assessment",
                link: `/patient/${params.id}/primary-assessment`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            title="Sample History"
            links={[
              {
                title: "Sample History",
                link: `/medical-history/${params.id}`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            title="Assessments"
            links={[
              {
                title: "Secondary Assessment",
                link: `/patient/${params.id}/secondary-assessment`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            onClick={setActiveStep}
            links={[
              {
                id: 0,
                title: "Differential Diagnosis",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 1,
                title: "Investigations",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 2,
                title: "Final Diagnosis",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 3,
                title: "Medication",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 4,
                title: "Disposition",
                link: `/patient/${params.id}/disposition`,
              },


            ]}
            title="Consultation"
          />
          {/* New Button */}

        </WrapperBox>
        <BasicAccordion />
      </MainGrid>
      <MainGrid item lg={9}>
        <VitalsPanel />
        <WrapperBox
          sx={{
            display: "flex",
            gap: "1ch",
            marginTop: "1ch",
            marginLeft: "5px",
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              height: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "1ch",
              }}
            >
              <MainButton
                title={"BP"}
                onClick={() => handleButtonClickTop("bp")}
                sx={{
                  margin: "0 1ch 0 0",
                  borderRadius: "5px",
                  ...(selectedChartTop === "bp" ? {} : inActiveButtonStyle),
                }}
              />
              <MainButton
                title={"HeartRate"}
                onClick={() => handleButtonClickTop("hr")}
                sx={{
                  borderRadius: "5px",
                  ...(selectedChartTop === "hr" ? {} : inActiveButtonStyle),
                }}
              />
            </div>
            {selectedChartTop === "bp" && (
              <LineChartComponent
                key={`top-bp-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  {
                    key: "systolicbpData",
                    label: "Systolic BP",
                    color: "blue",
                  },
                  {
                    key: "diastolicbpData",
                    label: "Diastolic BP",
                    color: "red",
                  },
                ]}
              />
            )}
            {selectedChartTop === "hr" && (
              <LineChartComponent
                key={`top-hr-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: "heartRateData", label: "Heart Rate", color: "green" },
                ]}
              />
            )}
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              height: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "1ch",
              }}
            >
              <MainButton
                title={"Glucose"}
                onClick={() => handleButtonClickBottom("glu")}
                sx={{
                  margin: "0 1ch 0 0",
                  borderRadius: "5px",
                  ...(selectedChartBottom === "glu" ? {} : inActiveButtonStyle),
                }}
              />
              <MainButton
                title={"Temp"}
                onClick={() => handleButtonClickBottom("temp")}
                sx={{
                  margin: "0 1ch 0 0",
                  borderRadius: "5px",
                  ...(selectedChartBottom === "temp"
                    ? {}
                    : inActiveButtonStyle),
                }}
              />
              <MainButton
                title={"RR"}
                onClick={() => handleButtonClickBottom("rr")}
                sx={{
                  borderRadius: "5px",
                  ...(selectedChartBottom === "rr" ? {} : inActiveButtonStyle),
                }}
              />
            </div>

            {selectedChartBottom === "glu" && (
              <LineChartComponent
                key={`bottom-glu-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: "glucoseData", label: "Glucose", color: "purple" },
                ]}
              />
            )}
            {selectedChartBottom === "temp" && (
              <LineChartComponent
                key={`bottom-temp-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: "tempData", label: "Temperature", color: "orange" },
                ]}
              />
            )}
            {selectedChartBottom === "rr" && (
              <LineChartComponent
                key={`bottom-rr-${JSON.stringify(chartData.xAxisData)}`}
                chartData={chartData}
                xAxisData={chartData.xAxisData}
                series={[
                  { key: "rrData", label: "Respiratory Rate", color: "cyan" },
                ]}
              />
            )}
          </div>
        </WrapperBox>

        <Tabs
          value={value}
          onChange={handleChange}
          style={{ marginTop: "1ch", marginLeft: "5px" }}
        >
          <Tab
            style={{
              borderTopLeftRadius: "4px",
              padding: "10px 20px",
              minWidth: "120px",
              background: value === 0 ? "#ffffff" : "transparent",
              fontWeight: value === 0 ? "bold" : "normal",
              border: "1px solid #ccc",
              borderBottom: "none",
              borderRight: "none",
            }}
            label="Investigations"
          ></Tab>
          <Tab
            label="Clinical Notes"
            style={{
              padding: "10px 20px",
              minWidth: "120px",
              background: value === 1 ? "#ffffff" : "transparent",
              fontWeight: value === 1 ? "bold" : "normal",
              border: "1px solid #ccc",
              borderBottom: "none",
              borderRight: "none",
            }}
          ></Tab>
          <Tab
            label="Results"
            style={{
              padding: "10px 20px",
              minWidth: "120px",
              background: value === 2 ? "#ffffff" : "transparent",
              fontWeight: value === 2 ? "bold" : "normal",
              border: "1px solid #ccc",
              borderBottom: "none",
              borderRight: "none",
            }}
          ></Tab>
          <Tab
            label="Medications"
            style={{
              borderBottomRightRadius: "4px",
              borderTopRightRadius: "4px",
              padding: "10px 20px",
              minWidth: "120px",
              background: value === 3 ? "#ffffff" : "transparent",
              fontWeight: value === 3 ? "bold" : "normal",
              border: "1px solid #ccc",
              borderBottom: "none",
            }}
          ></Tab>
        </Tabs>
        <Box
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginLeft: "5px",
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
                // 0tnxas
                // Yc7flfzx
                >
                  {icon && (
                    <Image src={icon ? icon : "/test"} alt="AETC Form icon" />
                  )}
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
