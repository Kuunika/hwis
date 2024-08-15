"use client";
import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { MonitoringChart } from "./components/monitoringChart";

function NursingChart() {
  return (
    <>
      <PatientInfoTab />
      <MonitoringChart/>
    </>
  );
}


export default AuthGuard(NursingChart, [roles.CLINICIAN, roles.NURSE, roles.ADMIN]);