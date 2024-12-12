"use client";
import { PresentingComplaintsForm } from "@/app/triage/components";
import { FormContainer, MainTypography, WrapperBox } from "@/components";
import { PatientInfoTab } from "@/components";
import { FaAngleLeft } from "react-icons/fa6";
import PresentingComplaintsPanel from "./components/pastPresentingComplaints";
import { useNavigation } from "@/hooks";
import DrugHistoryPanel from "./components/drugHistory";
import { Box } from "@mui/material";


function InPatientAdmission() {

  const { navigateBack } = useNavigation();

  
  return (
    <>
      <PatientInfoTab />
      <WrapperBox
            onClick={() => navigateBack()}
            sx={{ display: { lg: "flex", xs: "none" }, cursor: "pointer", pt:'2ch', pl:'2ch', mb:'2ch'}}
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
          <Box sx={{ display: 'flex', gap: '2ch' }}>
          <WrapperBox sx={{ pl: '2ch', mb: '2ch', width: '50%' }}>
            <PresentingComplaintsPanel />
          </WrapperBox>
          <WrapperBox sx={{ pl: '2ch', mb: '2ch', width: '50%', mr:'2ch' }}>
            <DrugHistoryPanel />
          </WrapperBox>
        </Box>
    </>
  );
}


export default InPatientAdmission;