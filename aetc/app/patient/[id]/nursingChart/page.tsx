"use client";
import { FormContainer, PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { MonitoringChart } from "./components/monitoringChart";

function NursingChart() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <MonitoringChart />
      </FormContainer>
    </>
  );
}

export default AuthGuard(NursingChart, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
