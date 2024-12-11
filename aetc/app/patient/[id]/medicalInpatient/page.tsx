"use client";
import { PresentingComplaintsForm } from "@/app/triage/components";
import { FormContainer, MainTypography, WrapperBox } from "@/components";
import { PatientInfoTab } from "@/components";
import { FaAngleLeft } from "react-icons/fa6";
import PresentingComplaintsPanel from "./components/pastPresentingComplaints";
import { useNavigation } from "@/hooks";


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
          <PresentingComplaintsPanel/>
    </>
  );
}


export default InPatientAdmission;