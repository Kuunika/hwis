"use client";
import { FormContainer, PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { MonitoringChart } from "./monitoringChart";

function NursingChartPage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <MonitoringChart />
      </FormContainer>
    </>
  );
}

export default AuthGuard(NursingChartPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
