"use client";
import React, { useState, useEffect } from "react";
import { NewStepperContainer } from "@/components";
import { useNavigation } from "@/hooks";
import { Box, Button } from "@mui/material";
import { PersonalInformationForm } from "./PersonalInformationForm";
import { ComplaintsForm } from "./ComplaintsForm";
import { MedicalHistoryForm } from "./MedicalHistoryForm";
import { HabitsForm } from "./HabitsForm";
import { GeneralExaminationsForm } from "./GeneralExaminationsForm";
import { ObstetricGynecologyHistoryForm } from "./ObstetricGynecologyHistoryForm";

export const GyneacologyFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const { navigateBack } = useNavigation();

    const steps = [
        // { id: 0, label: "Personal Information" },
        { id: 0, label: "Complaints" },
        { id: 1, label: "Obstetric And Gynaecology History" },
        { id: 2, label: "Medical History" },
        { id: 3, label: "Habits" },
        { id: 4, label: "General Examination" },






    ];
    useEffect(() => {
        console.log(`Active step is now: ${activeStep}`);
    }, [activeStep]);

    return (
        <NewStepperContainer
            title="Gyneacology Ward Admission Form"
            steps={steps}
            active={activeStep}
            setActive={setActiveStep}
            onBack={() => navigateBack()} >
            {/* <>
                <PersonalInformationForm onSkip={() => { }} onSubmit={() => setActiveStep(1)} />
            </> */}
            <>
                <ComplaintsForm onSkip={() => { }} onSubmit={() => setActiveStep(1)} />
            </>
            <>
                <ObstetricGynecologyHistoryForm onSkip={() => { }} onSubmit={() => setActiveStep(2)} />
            </>
            <>
                <MedicalHistoryForm onSkip={() => { }} onSubmit={() => setActiveStep(3)} />
            </>
            <>
                <HabitsForm onSkip={() => { }} onSubmit={() => setActiveStep(4)} />
            </>
            <>
                <GeneralExaminationsForm onSkip={() => { }} onSubmit={() => setActiveStep(4)} />
            </>


        </NewStepperContainer>
    );


};