"use client";
import { FormContainer, PatientInfoTab } from "@/components";
import { StartConsultationFlow } from "./startConsultationFlow";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";

const ConsultationPage = () => {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <StartConsultationFlow />
      </FormContainer>
    </>
  );
};

// export default Consultation;
export default AuthGuard(ConsultationPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
