 "use client";
// import { FormContainer, PatientInfoTab } from "@/components";
// import { roles } from "@/constants";
// import AuthGuard from "@/helpers/authguard";
// import { GynaeWorkflow } from "@/app/patient/[id]/gynae/components/gynaeWorkFlow";

// function GynaeEvaluationPage() {
//   return (
//     <>

//       <FormContainer>
//         <GynaeWorkflow />
//       </FormContainer>
//     </>
//   );
// }

// export default AuthGuard(GynaeEvaluationPage, [
//   roles.CLINICIAN,
//   roles.NURSE,
//   roles.ADMIN,
//   roles.STUDENT_CLINICIAN,
// ]);



 import TestForm from "./components/test";
 
 export default function TestPage() {
   return <TestForm />;
 }
 