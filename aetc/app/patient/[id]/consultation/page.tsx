import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { StartConsultationFlow } from "./components/startConsultationFlow";

function Consultation() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <StartConsultationFlow />
      </FormContainer>
    </>
  );
}

// export default Consultation;
export default AuthGuard(Consultation, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
