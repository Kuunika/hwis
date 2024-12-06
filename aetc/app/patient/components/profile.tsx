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
import { TabsContainer } from "./tabsContainer";

export const DesktopView = () => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);
  const { data, isLoading } = getPatientsEncounters(params?.id as string);

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
      console.log({ data });
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
      setChartLoading(false);
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
                link: `/patient/${params.id}/medical-history`,
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
            ]}
            title="Consultation"
          />
          {/* New Button */}
          <ConsultationCard
            disabled={!isOnList}
            title="Disposition"
            links={[
              {
                title: "Disposition",
                link: `/patient/${params.id}/disposition`,
              },
            ]}
          />

          <ConsultationCard
            disabled={!isOnList}
            title="Template Forms"
            links={[
              {
                title: "Medical Inpatient",
                link: `/patient/${params.id}/medicalInpatient`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src={"/icons/medicalInpatient.svg"}
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Surgical Notes",
                link: `/patient/${params.id}/surgicalNotes`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/surgicalnotes.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Gynacological",
                link: `/patient/${params.id}/gynacological`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/gynacology.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Monitoring Chart",
                link: `/patient/${params.id}/nursingChart`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/monitoring.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Referral",
                link: `/patient/${params.id}/referral`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/referral.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
            ]}
          />
        </WrapperBox>
        {/* <BasicAccordion /> */}
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
        <TabsContainer />
      </MainGrid>
      <FlowStarter patient={params} />
    </MainGrid>
  );
};
