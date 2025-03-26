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
import React, { useState, useEffect } from "react";
import { NewStepperContainer } from "@/components";
import { useNavigation } from "@/hooks";
import { Box, Button } from "@mui/material";

import { PresentingComplaintsForm } from "./PresentingComplaintsForm";
import { PastMedicalHistoryForm } from "./PastMedicalHistoryForm";
import { FamilyHistoryForm } from "./FamilyHistoryForm";
import { PastSurgicalHistoryForm } from "./PastSurgicalHistoryForm";
import { AllergiesForm } from "./AllergiesForm";
import { SocialHistoryForm } from "./SocialHistoryForm";
// import { GynaeObstetricHistoryForm } from "./GynaeForm";
// import { ReviewOfSystemsForm } from "./ReviewOfSystemsForm";

export const SurgicalNotesFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const { navigateBack } = useNavigation();

    const steps = [
        { id: 0, label: "Presenting Complaints" },
        { id: 1, label: "Past Medical History" },
        { id: 2, label: "Past Surgical History" },
        { id: 3, label: "Family History" },
        { id: 4, label: "Allergies" },
        { id: 5, label: "Social History" },
        { id: 6, label: "Gynae History" },
        { id: 7, label: "Review of Systems" },


    ];
    useEffect(() => {
        console.log(`Active step is now: ${activeStep}`);
    }, [activeStep]);


    const stepComponents = [

    ];

    return (
        <NewStepperContainer
            title="Surgical Notes"
            steps={steps}
            active={activeStep}
            setActive={setActiveStep}
        >
            <>
                <PresentingComplaintsForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(1)}
                />
            </>

            <>
                <PastMedicalHistoryForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(2)}
                />
            </>

            <>
                <PastSurgicalHistoryForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(3)}
                />
            </>
            <>
                <FamilyHistoryForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(4)}
                />
            </>
            <>
                <AllergiesForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(5)}
                />
            </>

            <>
                <SocialHistoryForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(5)}
                />
            </>

            {/* <>
                <GynaeObstetricHistoryForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(5)}
                />
            </> */}

            {/* <>
                <ReviewOfSystemsForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(5)}
                />
            </> */}


        </NewStepperContainer>
    );
};

const StepButtons = ({
    onPrevious,
    onNext,
}: {
    onPrevious?: () => void;
    onNext?: () => void;
}) => {
    return (
        <Box sx={{ mt: "1ch" }}>
            {onPrevious && (
                <Button
                    sx={{ mr: "0.5ch" }}
                    size="small"
                    variant="contained"
                    color="inherit"
                    onClick={onPrevious}
                >
                    Previous
                </Button>
            )}
            {onNext && (
                <Button size="small" variant="contained" color="inherit"
                    onClick={onNext}>
                    Next
                </Button>
            )}
        </Box>
    );
};
