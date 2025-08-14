// "use client";
// import React from "react";
// import GeneralDetailsForm from "./components/generalDetails";
// import PregnancyHistoryForm from "./components/historyDetails";
// import PregnancyAdditionalHistoryForm from "./components/gynaeHistory";
// import ExamForm from "./components/examination";

// const GynaePage = () => {
//   const handleForm = (formData: any) => {
//     console.log(formData);
//   };
//   return (
//     <>
//       <div>
//         <GeneralDetailsForm onSubmit={handleForm} />;
//       </div>

//       <div>
//         <PregnancyHistoryForm onSubmit={handleForm} />
//       </div>

//       <div>
//         <PregnancyAdditionalHistoryForm onSubmit={handleForm} />
//       </div>

//       <div>
//         <ExamForm onSubmit={handleForm} />
//       </div>
//     </>
//   );
// };

// export default GynaePage;

"use client";

import { FormContainer, PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { GynaeWorkflow } from "@/app/patient/[id]/gynae/components/gynaeWorkFlow";

function GynaeEvaluationPage() {
  return (
    <>

      <FormContainer>
        <GynaeWorkflow />
      </FormContainer>
    </>
  );
}

export default AuthGuard(GynaeEvaluationPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
  roles.STUDENT_CLINICIAN,
]);
