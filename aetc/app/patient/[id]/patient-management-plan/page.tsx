"use client";
import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { PatientManagementPlan } from "./components/patientmanagementplan";


function Patientplan() {
  return (
    <>

      { <PatientInfoTab /> }
      <PatientManagementPlan />
    </>
  );
}


export default AuthGuard(Patientplan, [roles.CLINICIAN, roles.NURSE, roles.ADMIN]);