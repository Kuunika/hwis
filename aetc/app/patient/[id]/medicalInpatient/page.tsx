"use client";
import { PresentingComplaintsForm } from "@/app/triage/components";
import { FormContainer, MainTypography, WrapperBox } from "@/components";
import { PatientInfoTab } from "@/components";
import { FaAngleLeft } from "react-icons/fa6";
import PresentingComplaintsPanel from "./components/pastPresentingComplaints";
import { useNavigation } from "@/hooks";
import DrugHistoryPanel from "./components/drugHistory";
import { Box } from "@mui/material";
import PastMedicalHistoryPanel from "./components/pastMedicalHistory";
import PastSurgicalHistoryPanel from "./components/pastSurgicalHistory";


function InPatientAdmission() {

  const { navigateBack } = useNavigation();

  
  return (
    <>
      <PatientInfoTab />
      <WrapperBox
  onClick={() => navigateBack()}
  sx={{
    display: { lg: "flex", xs: "none" },
    cursor: "pointer",
    pt: "2ch",
    pl: "2ch",
    mb: "2ch",
  }}
>
  <MainTypography
    sx={{
      width: "24px",
      height: "24px",
      fontSize: "20px",
      fontWeight: 400,
    }}
  >
    <FaAngleLeft />
  </MainTypography>
  <MainTypography
    sx={{
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "21px",
      letterSpacing: "0em",
      textAlign: "left",
    }}
  >
    Back
  </MainTypography>
</WrapperBox>
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, 
    gap: "1.5ch",
    gridAutoFlow: "dense",
    pl: "2ch",
    pr: "2ch",
    alignItems: "start",
  }}
>

  <WrapperBox sx={{ width: "100%" }}>
    <PresentingComplaintsPanel />
  </WrapperBox>
  <WrapperBox sx={{ width: "100%"}}>
    <PastMedicalHistoryPanel />
  </WrapperBox>


  <WrapperBox sx={{ width: "100%", gridColumn: "1 / -1" }}>
    <DrugHistoryPanel />
  </WrapperBox>

  <WrapperBox sx={{ width: "100%", gridColumn: "1 / -1" }}>
    <PastSurgicalHistoryPanel />
  </WrapperBox>
</Box>
    </>
  );
}


export default InPatientAdmission;