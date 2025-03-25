// "use client";
// import React from "react";
// import { useState } from "react";
// import { NewStepperContainer } from "@/components";
// import { useNavigation } from "@/hooks";
// import { PresentingComplaintsForm } from "./PresentingComplaintsForm.tsx"
// import { encounters } from "@/constants";

// export const SurgicalNotesFlow = () => {
//     const [activeStep, setActiveStep] = useState<number>(0);
//     const { navigateBack } = useNavigation();


//     const steps = [
//         {
//             id: 1,
//             label: "Presenting Complaints",
//         },
//         {
//             id: 2,
//             label: "Past Medical history",
//         },
//         {
//             id: 3,
//             label: "Family History",
//         },
//         // {
//         //     id: 4,
//         //     label: "Allergies",
//         // },
//         // {
//         //     id: 5,
//         //     label: "Social History",
//         // },
//         // {
//         //     id: 6,
//         //     label: "Gynae/Obstetric History",
//         // },
//     ];
//     const handleAirwaySubmit = () => {
//         setActiveStep(1);
//     };
//     return (
//         <>
//             <NewStepperContainer
//                 setActive={setActiveStep}
//                 title="Surgical Notes"
//                 steps={steps}
//                 active={activeStep}
//                 onBack={() => navigateBack()}
//                 showSubmittedStatus children={[]}  >




//             </NewStepperContainer>
//         </>
//     )
// }




"use client";
import React, { useState } from "react";
import { NewStepperContainer } from "@/components";
import { useNavigation } from "@/hooks";
import { PresentingComplaintsForm } from "./PresentingComplaintsForm";
import { PastMedicalHistoryForm } from "./PastMedicalHistoryForm";
import { FamilyHistoryForm } from "./FamilyHistoryForm";
import { PastSurgicalHistoryForm } from "./PastSurgicalHistoryForm";
import { AllergiesForm } from "./AllergiesForm";
export const SurgicalNotesFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const { navigateBack } = useNavigation();

    const steps = [
        { id: 1, label: "Presenting Complaints" },
        { id: 2, label: "Past Medical History" },
        { id: 3, label: "Past Surgical History" },
        { id: 4, label: "Family History" },
        { id: 5, label: "Allergies" },


    ];

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <PresentingComplaintsForm />;
            case 1:
                return <PastMedicalHistoryForm />;
            case 2:
                return <PastSurgicalHistoryForm />;
            case 3:
                return <FamilyHistoryForm />;
            case 4:
                return <AllergiesForm />;
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <NewStepperContainer
            setActive={setActiveStep}
            title="Surgical Notes"
            steps={steps}
            active={activeStep}
            onBack={navigateBack}
            showSubmittedStatus
        >
            {[renderStepContent()]} {/* Wrap in an array */}
        </NewStepperContainer>
    );
};